import { Questions } from "./questions.js";

let game_is_active = true;
let click_song_is_active = true;

const game_is_active_func = () => {
	return game_is_active;
};

let play_env_song = new Audio("./env_song.mp3");
play_env_song.volume = "1";
play_env_song.loop = true;
play_env_song.play();

const click_song_func = () => {
	if (click_song_is_active) {
		let click_song = new Audio("./click_song.mp3");
		click_song.volume = "0.6";
		click_song.play();
	} else {
		// handle way you want
	}
};

window.addEventListener("click", click_song_func);

// select all variables for the project
const html_tag = document.querySelector("html"),
	nav_cont = document.querySelector(".nav_cont"),
	menu_btn = document.querySelector(".menu_btn"),
	close_nav = document.querySelector(".close_nav"),
	current_score = document.querySelector(".current_score p"),
	ques_text = document.querySelector(".ques_text"),
	ques_time = document.querySelector(".ques_time"),
	remain_ques = document.querySelector(".remain_ques"),
	fake_layer = document.querySelector(".fake_layer"),
	responses = document.querySelector(".responses"),
	category_game = document.querySelector("#category_game"),
	start_game_btn = document.querySelector("#start_game"),
	play_again_btn = document.querySelector("#play_again"),
	font_size_value = document.querySelector("#font_size_value"),
	env_song = document.querySelector("#env_song"),
	click_song_btn = document.querySelector("#click_song"),
	share = document.querySelector("#share"),
	themes = Array.from(document.querySelectorAll("#themes .theme_cont")),
	your_score = document.querySelector(".your_score span"),
	play_screen = document.querySelector(".play_screen"),
	result_screen = document.querySelector(".result_screen");

for (const key in Questions) {
	if (Object.hasOwnProperty.call(Questions, key)) {
		category_game.innerHTML += `<option>${key}</option>`;
	}
}

current_score.innerHTML = 0;
remain_ques.innerHTML = 1;

category_game.addEventListener("change", () => {
	render_ques();
});

const used_question_indices = [];
let time = 0;
let timer = 0;

const start_timer = () => {
	clearInterval(timer);

	if (game_is_active_func()) {
		timer = setInterval(update_time, 1000);
	}
};

const update_time = () => {
	fake_layer.className = "under_layer fake_layer";
	time++;
	let time_percent = Math.round((time / 15) * 100);
	ques_time.style.background = `linear-gradient(to right, red 0% ${time_percent}%, pink 0%)`;

	if (time == 15) {
		time = 0;
		remain_ques.textContent = parseInt(remain_ques.textContent) + 1;
		current_score.textContent = parseInt(current_score.textContent) - 10;
		start_timer();

		start_game(category_game.value);
		fake_layer.className = "under_layer fake_layer fake_layer_move";
	}
};

const start_game = (param) => {
	let init_ques = Array.from(Questions[`${param}`]);

	if (used_question_indices.length === init_ques.length) {
		// All questions have been used. Handle this case as needed.
		alert("No more question");
		window.location.reload();
	}

	let random_index;
	do {
		random_index = Math.floor(Math.random() * init_ques.length);
	} while (used_question_indices.includes(random_index));

	used_question_indices.push(random_index);

	responses.innerHTML = "";

	ques_text.textContent = init_ques[random_index].question;

	for (const key in init_ques[random_index].respons) {
		if (Object.hasOwnProperty.call(init_ques[random_index].respons, key)) {
			const element = init_ques[random_index].respons[key];
			responses.innerHTML += `<div class="resp">${element} <input type="hidden"  value="${key}" /> </div>`;

			responses.style.pointerEvents = "all";

			const resp = document.querySelectorAll(".resp");

			if (parseInt(remain_ques.textContent) == 11) {
				remain_ques.textContent = "10";
				end_game();
			}

			resp.forEach((item) => {
				item.addEventListener("click", () => {
					time = 0;

					remain_ques.textContent = parseInt(remain_ques.textContent) + 1;

					if (item.children[0].value == init_ques[random_index].answer) {
						item.classList.add("correct_resp");

						current_score.textContent = parseInt(current_score.textContent) + 20;

						responses.style.pointerEvents = "none";
						fake_layer.className = "under_layer fake_layer fake_layer_move";

						setTimeout(() => {
							start_game(category_game.value);
							fake_layer.className = "under_layer fake_layer";
						}, 1000);
					} else {
						item.classList.add("wrong_resp");

						current_score.textContent = parseInt(current_score.textContent) - 10;

						responses.style.pointerEvents = "none";
						fake_layer.className = "under_layer fake_layer fake_layer_move";

						setTimeout(() => {
							start_game(category_game.value);
							fake_layer.className = "under_layer fake_layer";
						}, 1000);
					}
				});
			});
		}
	}
};

const end_game = () => {
	let end_game_song = new Audio("./end_song.mp3");
	play_env_song.pause();
	end_game_song.play();

	game_is_active = false;

	start_timer();

	document.querySelector(".active_screen").classList.remove("active_screen");
	result_screen.classList.add("active_screen");

	let score = parseInt(current_score.innerHTML);
	score < 99
		? (your_score.style.color = "red")
		: (your_score.style.color = "green");

	your_score.innerHTML = `</br></br> ${score} <b style="color: var(--text-color);">/200</b>`;
};

const render_ques = () => {
	if (category_game.value == "Select a subject.") {
		start_game_btn.style.pointerEvents = "none";
		start_game_btn.style.opacity = "0.5";
	} else {
		start_game_btn.style.pointerEvents = "all";
		start_game_btn.style.opacity = "1";
	}

	switch (category_game.value) {
		case "General":
			start_game("General");
			break;
		case "History":
			start_game("History");
			break;
		case "Web":
			start_game("Web");
			break;
		case "Anime":
			start_game("Anime");
			break;
		case "Mythology":
			start_game("Mythology");
			break;
	}
};

render_ques();

start_game_btn.onclick = () => {
	document.querySelector(".active_screen").classList.remove("active_screen");
	play_screen.classList.add("active_screen");
	start_timer();
};
// get the save theme or " " from localStorage
// the default blue theme equal to an empty string
let save_theme = localStorage.getItem("theme_value") || "";
// set theme value to html_tag className
html_tag.className = save_theme;

let check_theme = themes.filter((val) =>
	val.classList.contains(`${save_theme}`),
);
if (check_theme[0]) {
	check_theme[0].classList.add("check");
}else{

}

// Slide menu script for touch screen
let start_position = 0;

function start_drag(event) {
	if (event.type === "touchstart") {
		start_position = window.innerWidth - event.touches[0].clientX;
	}
}

function drag(event) {
	if (
		event.type === "touchmove" &&
		start_position > start_position - 20 &&
		!nav_cont.classList.contains("nav_active")
	) {
		nav_cont.classList.add("nav_active");
	} else if (
		event.type === "touchmove" &&
		start_position < start_position - 20 &&
		nav_cont.classList.contains("nav_active")
	) {
		nav_cont.classList.remove("nav_active");
	}
}
window.addEventListener("touchstart", start_drag);
window.addEventListener("touchmove", drag);
//End of slide menu script for touch screen

menu_btn.onclick = () => {
	nav_cont.classList.add("nav_active");
};

close_nav.onclick = () => {
	nav_cont.classList.remove("nav_active");
};

nav_cont.onclick = (e) => {
	if (e.target.classList.contains("nav_cont")) {
		nav_cont.classList.remove("nav_active");
	}
};
let default_font_size = localStorage.getItem("font_size") || 1;
font_size_value.value = default_font_size;

html_tag.style.fontSize = `${default_font_size}rem`;

font_size_value.onchange = () => {
	font_size_value.value;
	html_tag.style.fontSize = `${font_size_value.value}rem`;
	localStorage.setItem("font_size", `${font_size_value.value}`);
};

themes.forEach((theme) => {
	theme.onclick = () => {
		localStorage.setItem("theme_value", `${theme.children[1].value}`);
		html_tag.className = `${theme.children[1].value}`;
		document.querySelector(".check").classList.remove("check");
		theme.classList.add("check");
	};
});

const mute = (param, param_2, param_3) => {
	if (param_3) {
		if (param.volume == "1") {
			param.volume = "0";
			param_2.classList.add("off");
		} else {
			param.volume = "1";
			param_2.classList.remove("off");
		}
	}
};

env_song.onclick = () => {
	mute(play_env_song, env_song, true);
};

click_song_btn.onclick = () => {
	if (!click_song_btn.classList.contains("off")) {
		click_song_is_active = false;
		click_song_btn.classList.add("off");
	} else {
		click_song_btn.classList.remove("off");
		click_song_is_active = true;
	}
};

play_again_btn.onclick = () => {
	window.location.reload();
};
