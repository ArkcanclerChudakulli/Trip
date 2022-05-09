let save;
let day = false;
let date = 1;
let hour = 9;
let minute = 30;
let speed = 45;
let originalBenzinPrice = 49;
let originalUpgradePrice = 3000;
let benzinPrice = 49;
let upgradePrice = 3000;
let karmaDiscount = 0;
let kmToPekin = 7900;
let tank = 50;
let currentLocation = 0;
let currentBenzin = 50;
let money = 5000;
let karma = 0;
let loto_count = 0;
let win_count = 0;
let loto_tickets = 5;
let loto_tickets_max = 5;

const loto_wins = [];
const loto_rolls = [];

let currentSong = 0;
let currentQuest = 0;
let rashodBenzina = 0.15;
let rashodLitrov = 1;
let currentHour = 0;
let currentMinute = 0;
let currentKM = 28;
let hourInterval = null;
let minuteInterval = null;
let riding = null;
let benzinUsing = null;
let destination = null;
let distanceMultiplier = 1;

function load(){
	shuffle(songs);
	shuffle(quests);
	load_loto();
	if(save){
		day = save_day;
		date = save_date;
		$('#day').html(date);
		hour = save_hour;
		$('#hour').html(hour);
		minute = save_minute;
		 if(minute >= 10){
			$('#minute').html(minute);
	   } else {
			$('#minute').html("0" + minute);
	   }
		speed = save_speed;
		$('#speed').html(speed);
		benzinPrice = save_benzinPrice;
		kmToPekin = save_kmToPekin;
		$('#km').html(save_kmToPekin);
		$('#next_km').html(save_nextKM);
		$('#next_l').html(save_nextL);
		tank = save_tank;
		$('#tank').html(tank);
		currentLocation = save_currentLocation;
		$('#town_title').html(locations[currentLocation].title);
		$("#emblem").attr("src", locations[currentLocation].emblem);
		$('#region').html(locations[currentLocation].region);
		currentBenzin = save_currentBenzin;
		$('#benzin').html(currentBenzin);
		money = save_money;
		$('#money').html(money);
		karma = save_karma;
		$('#karma').html(karma);
	}
}

function salut(){
	mirror('Вот и Пекин, сердце Поднебесной. Салют знаменует окончание автомобильного приключения. Как говорят в Испании, "Buen Camino!" = "Доброго Пути!"', 5, 'red');
	$('#km').html(0);
	$('#next_km').html(0);
	$('#next_l').html(0);
	$('#town_title').html("Пекин");
	$("#emblem").attr("src", "img/town/kit.png");
	$('#region').html("Пекин");
	$('#start').prop('disabled', true);
	$('#rout').hide();
	let audio = new Audio("audio/final/final.mp3");
	audio.play();
	$("#car").attr("src", "video/salut.mp4");
	$("#car").show();
}

function settings(){
	$('#newGame').toggle();
	$('#saveGame').toggle();
}

function newGame()
{
	window.alert('Выберите файл save.js, перезапишите его и обновите страницу браузера, чтобы вернуться в Санкт-Петербург.');
    location.href = "data:application/octet-stream;charset=UTF-8,";
}

function saveGame()
{
	window.alert('Выберите файл save.js и перезапишите его, чтобы сохранить игру.');
	let data = 'save=true;let%20save_day=' + day + ';let%20save_date=' + date + ';let%20save_hour=' + hour
				+ ';let%20save_minute=' + minute + ';let%20save_speed=' + speed + ';let%20save_benzinPrice=' + benzinPrice
				+ ';let%20save_kmToPekin=' + kmToPekin + ';let%20save_nextKM=' + locations[currentLocation+1].km
				+ ';let%20save_nextL=' + Math.floor(locations[currentLocation+1].km* rashodBenzina)
				+ ';let%20save_tank=' + tank + ';let%20save_currentLocation=' + currentLocation + ';let%20save_currentBenzin=' + currentBenzin
				+ ';let%20save_money=' + money + ';let%20save_karma=' + karma;
	location.href = "data:application/octet-stream;charset=UTF-8," + data;
} 

function load_loto(){
	let random;
	let min = 1;
	let max = 10;
	for(let i = 1; i <= 15; i++){
		if(i == 15) max = 99;
		random = getRandomInt(min, max);
		loto_wins.push(random);
		$('#loto_' + i).html(random);
		min = random + 1;
		max += 6;
	}
}

function roll_loto(){
	if(loto_tickets == 0){
		mirror('Извините, лотерейные билеты закончились. Попробуйте заехать в киоск Авто-Лото в другом городе!', 20, 'red');
		$('#loto').prop('disabled', true);
	} else {	
		loto_tickets--;
		money -= 49;
		$('#money').html(money);
		let num = roll_loto_random();
		loto_rolls.push(num);
		mirror('Выпало число... ' + num + '. Открыто ' + loto_rolls.length + '/99 (' + win_count + ' угадано).', 20, 'green');
		if(loto_wins.includes(num)){
			win_count++;
			let bonus = (500 * win_count * 1.5) + (karma * 10);
			money += bonus;
			mirror('Выпало число... ' + num + '. Поздравляем! Вы открыли ' + win_count + ' цифру в Авто-Лото и выиграли ' + bonus + ' руб!', 20, 'red');
			$('#money').html(money);
			$('#loto_' + (loto_wins.indexOf(num)+1)).addClass('loto_win');
		}
	}
}

function clean_loto(){
	loto_tickets = loto_tickets_max;
	$('#loto').hide();
	$('#loto').prop('disabled', false);
}

function open_loto(add){
	currentQuest += add;
	$('#action_1').hide();
	$('#action_2').hide();
	$('#loto').show();
	$('#start').prop('disabled', false);
	mirror('Вы можете приобрести до ' + loto_tickets_max + ' лотерейных билетов по 49 руб за штуку.');
}

function roll_loto_random(){
	random = getRandomInt(1, 99);
	while(true){
		if(loto_rolls.includes(random)){
			random++;
			if(random == 100) random = 1;
		} else {
			return random;
		}
	}
}

function move(){
	/* salut(); */
	$('#rout').hide();
	$('#discount').hide();
	$('#start').prop('disabled', true);
	$('#car').show();
	clean_loto();
	mirror('...wroom wroom wroom...', 5, 'blue');
	/* road_signs();
	riding = setInterval(road_signs,3000); */
	play();
}

function road_signs(){
	shuffle(signs);
	mirror(signs[0], 5, 'blue');
}


function mirror(txt, speed, color){
$( "#mirror_txt" ).replaceWith( '<marquee id="mirror_txt" class="font text-center align-middle ' + color + '" direction="up" scrolldelay="1" scrollamount="' + speed + '" behavior="slide"><font id="road_text">' + txt + '</font></marquee>' );
}

function arrive(){
	clearInterval(riding);
	currentLocation++;
	currentKM = locations[currentLocation].km;
	calculateKM();
	calculateRoadTime();
	$("#car").attr("src", "video/rout/" + currentLocation + ".mp4");
}

function arriveText(){
	$('#next_km').html(locations[currentLocation+1].km);
	$('#next_l').html(Math.floor(locations[currentLocation+1].km* rashodBenzina));
	$('#town_title').html(locations[currentLocation].title);
	$("#emblem").attr("src", locations[currentLocation].emblem);
	$('#region').html(locations[currentLocation].region);
	$('#start').prop('disabled', true);
	deliver();
}

function activity(){
	nextQuest();
	let text_1;
	let text_2;
	if((currentBenzin - rashodLitrov) < Math.floor(tank/2)){
		$('#action_1').attr("src", "img/gasoline.jpg");
		$('#action_1').attr("onclick", "gasoline()");
		text_1 = "заправиться на бензоколонке";
		$('#action_2').attr("src", quests[currentQuest].questImg);
		$('#action_2').attr("onclick", quests[currentQuest].questMethod + "(0)");
		text_2 = quests[currentQuest].questText;
	} else {
		$('#action_1').attr("src", quests[currentQuest].questImg);
		$('#action_1').attr("onclick", quests[currentQuest].questMethod + "(0)");
		text_1 = quests[currentQuest].questText;
	
		if(destination){
			if(money >= upgradePrice){
				$('#action_2').attr("src", "img/upgrade.jpg");
				$('#action_2').attr("onclick", "upgrade()");
				text_2 = 'прокачать вашу "тачку" за ' + upgradePrice + ' руб';
			} else {
				$('#action_2').attr("src", quests[currentQuest+1].questImg);
				$('#action_2').attr("onclick", quests[currentQuest+1].questMethod + "(1)");
				text_2 = quests[currentQuest+1].questText;
			}
		} else {
			$('#action_2').attr("src", "img/postel.jpg");
			$('#action_2').attr("onclick", "postel()");
			text_2 = "взять посылку в другой город";
		}
	}
	
	$('#action_1').show();
	$('#action_2').show();
	mirror("Вы можете " + text_1 + " или " + text_2 + ".");
}

let quests = [
		{
			questText: "сыграть в Авто-Лото",
			questResult: "",
			questImg: "img/loto.jpg",
			questSong: "",
			questVideo: "",
			questMethod: "open_loto"
		},
		{
			questText: "помочь перевезти книги для районной библиотеки",
			questResult: "Вы помогли перевезти школьную литературу и получили от старшего библиотекаря небольшую благодарность.",
			questImg: "img/quest/knigi.jpg",
			questSong: "kant",
			questVideo: "video/quest/library.mp4",
			questMethod: "quest"
		},
		{
			questText: "помочь жениху и невесте успеть на свадьбу",
			questResult: "Вы помогли жениху и невесте добраться до церкви и получили от них небольшую благодарность.",
			questImg: "img/quest/wedding.jpg",
			questSong: "wedding",
			questVideo: "video/quest/wedding.mp4",
			questMethod: "quest"
		},
		{
			questText: "помочь дедушке отвезти тыкву на ярмарку",
			questResult: "Вы помогли дедушке выиграть приз за самую крупную тыкву и получили от него небольшую благодарность.",
			questImg: "img/quest/pumpkin.jpg",
			questSong: "popcorn",
			questVideo: "video/quest/pumpkin.mp4",
			questMethod: "quest"
		},
		{
			questText: "помочь с переездом многодетной семье",
			questResult: "Вы помогли семье отвезти вещи в новый дом и получили от них небольшую благодарность.",
			questImg: "img/quest/pereezd.jpg",
			questSong: "family",
			questVideo: "video/quest/family.mp4",
			questMethod: "quest"
		},
		{
			questText: "помочь туристам найти их гостиницу",
			questResult: "Вы отвезли туристов в их отель и получили от них небольшую благодарность.",
			questImg: "img/quest/tourist.jpeg",
			questSong: "Verona",
			questVideo: "video/quest/tourist.mp4",
			questMethod: "quest"
		},
		{
			questText: "помочь танцорам добраться до исторического бала",
			questResult: "Вы подвезли танцоров к порогу танцевального зала, чтобы они успели на полонез, и получили от них небольшую благодарность.",
			questImg: "img/quest/dancers.jpeg",
			questSong: "Fledermaus",
			questVideo: "video/quest/dancers.mp4",
			questMethod: "quest"
		},
		{
			questText: "помочь студентам успеть на пару",
			questResult: "Вы подвезли студентов к университету, и получили от них небольшую благодарность.",
			questImg: "img/quest/student.jpg",
			questSong: "studenty",
			questVideo: "video/quest/studenty.mp4",
			questMethod: "quest"
		},
		{
			questText: "помочь бабушке сбежать от погони",
			questResult:'"Спасибо, милок" - говорит бабушка, когда хвост отстал, и вы получаете от неё небольшую благодарность.',
			questImg: "img/quest/babushka.jpg",
			questSong: "Ma Baker",
			questVideo: "video/quest/money.mp4",
			questMethod: "quest"
		},
		{
			questText: "помочь потерявшемуся мальчику вернуться домой",
			questResult:'Вы возвращаете ребёнка перепуганным родителям и получаете от них небольшую благодарность.',
			questImg: "img/quest/boy.jpg",
			questSong: "boy",
			questVideo: "video/quest/boy.mp4",
			questMethod: "quest"
		}
];

function quest(add){
	currentQuest += add;
	mirror(quests[currentQuest].questResult, 3, 'green');
	calculateTime(120);
	money += 1000 + 10*karma;
	karma++;
	$('#money').html(money);
	$('#karma').html(karma);
	$('#action_1').hide();
	$('#action_2').hide();
	$('#quest').attr("src", quests[currentQuest].questVideo);
	$('#quest').show();
	playSong(quests[currentQuest].questSong);
}

function checkKarma(){
	if(karma % 5 == 0) {
		karmaDiscount = karma;
		benzinPrice = originalBenzinPrice - (originalBenzinPrice * karmaDiscount/100);
		upgradePrice = Math.floor(originalUpgradePrice - (originalUpgradePrice * karmaDiscount/100));
		$('#discount').attr("src", "img/karma/karma_" + karmaDiscount + ".jpg");
		$('#discount').show();
	}
}

function playSong(song){
	let audio = new Audio("audio/quest/" + song + ".mp3");
	audio.play();
	audio.onended = function() {
		$('#quest').hide();
		checkKarma();
		$('#start').prop('disabled', false);
	};
}

function nextQuest(){
	currentQuest++;
	if(currentQuest >= quests.length-1){
		shuffle(quests);
		currentQuest = 0;
	}
}

function endActivity(){
	$('#action_1').hide();
	$('#action_2').hide();
	$('#start').prop('disabled', false);
}

function gasoline(){
	let litr = tank - currentBenzin;
	let sum = Math.floor(litr * benzinPrice);
	currentBenzin = tank;
	 $('#benzin').html(currentBenzin);
	$('#benzin_img').attr("src","img/benzin_green.png");
	money -= sum;
	$('#money').html(money);
	mirror("Вы заплатили за " + litr + " л " + sum + " руб.");
	endActivity();
}

function upgrade(){
	money -= upgradePrice;
	$('#money').html(money);
	tank+=5;
	$('#tank').html(tank);
	speed+=5;
	$('#speed').html(speed);
	mirror('Вам "прокачали" вашу тачку, увеличив её скорость и объём топливного бака.');
	endActivity();
}

function postel(){
	distanceMultiplier++;
	if(distanceMultiplier >= locations.length){
		distanceMultiplier = locations.length;
	}
	destination = currentLocation + distanceMultiplier;
	mirror("Пункт доставки: " + locations[destination].title + ", " + locations[destination].region + ".");
	endActivity();
}

function deliver(){
	if(destination && destination == currentLocation){
		let bonus = 1000 * distanceMultiplier;
		money += bonus;
		$('#money').html(money);
		karma++;
		$('#karma').html(karma);
		checkKarma();
		destination = null;
		mirror("Вы доставили посылку и получили " + bonus + " руб.");
		$('#start').prop('disabled', false);
	} else {
		activity();
	}
}

function calculateRoadTime(){
	let minutesSum = Math.floor(currentKM/speed * 60);
	calculateTime(minutesSum);
}

function calculateTime(minutes){
	currentHour = Math.floor(minutes / 60);
	currentMinute = minutes % 60;
	hourInterval = setInterval(countHour,20);
	minuteInterval = setInterval(countMinute,20);
}

function countHour(){
	if(currentHour > 0) {
	   currentHour--;
	   hour++;
	   if(hour == 24){
		 hour = 0;
		 $('#day').html(++date);
	   }
	   $('#hour').html(hour);
	} else {
		 clearInterval(hourInterval);
		 checkSun();
	}
}

function countMinute(){
	if(currentMinute > 0) {
	   currentMinute--;
	   minute++;
	   if(minute == 60){
		 minute = 0;
		 hour++;
		  if(hour == 24){
			 hour = 0;
			 $('#day').html(++date);
		   }
		 $('#hour').html(hour);
		 checkSun();
	   }
	   if(minute >= 10){
			$('#minute').html(minute);
	   } else {
			$('#minute').html("0" + minute);
	   }
	} else {
		 clearInterval(minuteInterval);
	}
}

function checkSun(){
	if(hour >= 7 && hour < 13){
		$("#road").css('background-image','url(img/road/morning.jpg)');
	} else if(hour >= 13 && hour < 19){
		$("#road").css('background-image','url(img/road/day.jpg)');
	} else if(hour >= 1 && hour < 7 ){
		$("#road").css('background-image','url(img/road/night.jpg)');
	} else {
		$("#road").css('background-image','url(img/road/evening.jpg)');
	}			
			
	if(hour > 7 && hour < 22){
		if(!day){			
			day = true;
			$("#sun").attr("src", "img/sun.png");
		}
	} else {
		if(day){			
			day = false;
			$("#sun").attr("src", "img/month.png");
		}
	}
	
	/* if(hour >= 0 && hour < 2){
		$("#car").attr("src", "video/0_2.mp4");
	} else if(hour >= 2 && hour < 4){
		$("#car").attr("src", "video/2_4.mp4");
	} else if(hour >= 4 && hour < 6){
		$("#car").attr("src", "video/4_6.mp4");
	} else if(hour >= 6 && hour < 8){
		$("#car").attr("src", "video/6_8.mp4");
	} else if(hour >= 8 && hour < 10){
		$("#car").attr("src", "video/8_10.mp4");
	} else if(hour >= 10 && hour < 12){
		$("#car").attr("src", "video/10_12.mp4");
	} else if(hour >= 12 && hour < 14){
		$("#car").attr("src", "video/12_14.mp4");
	} else if(hour >= 14 && hour < 16){
		$("#car").attr("src", "video/14_16.mp4");
	} else if(hour >= 16 && hour < 18){
		$("#car").attr("src", "video/16_18.mp4");
	} else if(hour >= 18 && hour < 20){
		$("#car").attr("src", "video/18_20.mp4");
	} else if(hour >= 20 && hour < 22){
		$("#car").attr("src", "video/20_22.mp4");
	} else if(hour >= 22 && hour < 24){
		$("#car").attr("src", "video/22_24.mp4");
	} */
}

function calculateKM(){
	setInterval(km,20);
	rashodLitrov = Math.floor(currentKM * rashodBenzina);
	benzinUsing = setInterval(minusBenzin,100);
}

function km(){
	if(currentKM > 0) {
	   currentKM--;
	   $('#km').html(--kmToPekin);
	}
}

function minusBenzin(){
	if(rashodLitrov > 0) {
	   rashodLitrov--;
	   currentBenzin--;
	   if(currentBenzin <= 0){
		  clearInterval(benzinUsing);
		  mirror("Вcё приехали... Мотор заглох. Бензин на нуле. Придётся брать по двойной стоимости у дорожного барыги.");
		  currentBenzin = 0;
		  $('#benzin').html(currentBenzin);
		  $('#benzin_img').attr("src","img/benzin_black.png");
		  $('#start').prop('disabled', true);
		  $('#event').show();
	   } else {
		  checkBenzin();
		  $('#benzin').html(currentBenzin);
	   }
	} else {
		clearInterval(benzinUsing);
		arriveText();
	}
}

function dozapravka(){
	$('#event').hide();
	$('#start').prop('disabled', false);
	let litr = Math.floor(tank/2);
	let sum = Math.floor(litr * (benzinPrice*2));
	currentBenzin = litr;
	$('#benzin').html(currentBenzin);
	checkBenzin();
	money -= sum;
	$('#money').html(money);
	arriveText();
}

function checkBenzin(){
	if(currentBenzin > (tank*0.6)){
		$('#benzin_img').attr("src","img/benzin_green.png");
	} else if(currentBenzin > (tank*0.3)){
		$('#benzin_img').attr("src","img/benzin_yellow.png");
	} else {
		$('#benzin_img').attr("src","img/benzin_red.png");
	}
}

function play(){
	let audio = new Audio("audio/" + songs[currentSong] + ".mp3");
	audio.play();
	audio.onended = function() {
		currentSong++;
		if(currentSong >= songs.length){			
			shuffle(songs);
			currentSong = 0;
		}
		$('#car').hide();
		arrive();
		audio = new Audio('audio/brakes.mp3');
		audio.play();
	};
}

const locations = [
	{
		title: "Санкт-Петербург",
		emblem: "img/town/spb.png",
		region: "Северная Столица"
	},
	{
		title: "деревня Разметелево",
		emblem: "img/town/len.jpg",
		region: "Ленинградская область",
		km: 28
	},
	{
		title: "Шлиссельбург",
		emblem: "img/town/len.jpg",
		region: "Ленинградская область",
		km: 28
	},
	{
		title: "Сясьстрой",
		emblem: "img/town/len.jpg",
		region: "Ленинградская область",
		km: 99
	},
	{
		title: "Тихвин",
		emblem: "img/town/len.jpg",
		region: "Ленинградская область",
		km: 95
	},
	{
		title: "Пикалёво",
		emblem: "img/town/len.jpg",
		region: "Ленинградская область",
		km: 45
	},
	{
		title: "рабочий посёлок Сазоново",
		emblem: "img/town/vol.png",
		region: "Вологодская область",
		km: 83
	},
	{
		title: "посёлок им.Желябова",
		emblem: "img/town/vol.png",
		region: "Вологодская область",
		km: 90
	},
	{
		title: "посёлок Суда",
		emblem: "img/town/vol.png",
		region: "Вологодская область",
		km: 83
	},
	{
		title: "Череповец",
		emblem: "img/town/vol.png",
		region: "Вологодская область",
		km: 42
	},
	{
		title: "деревня Ясная Поляна",
		emblem: "img/town/yar.png",
		region: "Ярославская область",
		km: 110
	},
	{
		title: "Данилов",
		emblem: "img/town/yar.png",
		region: "Ярославская область",
		km: 84
	},
	{
		title: "Буй",
		emblem: "img/town/kos.png",
		region: "Костромская область",
		km: 110
	},
	{
		title: "Галич",
		emblem: "img/town/kos.png",
		region: "Костромская область",
		km: 58
	},
	{
		title: "посёлок Николо-Полома",
		emblem: "img/town/kos.png",
		region: "Костромская область",
		km: 76
	},
	{
		title: "Нея",
		emblem: "img/town/kos.png",
		region: "Костромская область",
		km: 32
	},
	{
		title: "Шарья",
		emblem: "img/town/kos.png",
		region: "Костромская область",
		km: 110
	},
	{
		title: "посёлок городского типа Ленинское",
		emblem: "img/town/kir.png",
		region: "Кировская область",
		km: 98
	},
	{
		title: "Котельнич",
		emblem: "img/town/kir.png",
		region: "Кировская область",
		km: 80
	},
	{
		title: "Киров",
		emblem: "img/town/kir.png",
		region: "Кировская область",
		km: 120
	},
	{
		title: "Белая Холуница",
		emblem: "img/town/kir.png",
		region: "Кировская область",
		km: 82
	},
	{
		title: "Чёрная Холуница",
		emblem: "img/town/kir.png",
		region: "Кировская область",
		km: 58
	},
	{
		title: "Омутнинск",
		emblem: "img/town/kir.png",
		region: "Кировская область",
		km: 36
	},
	{
		title: "посёлок Юбилейный",
		emblem: "img/town/kir.png",
		region: "Кировская область",
		km: 47
	},
	{
		title: "посёлок городского типа Афанасьево",
		emblem: "img/town/kir.png",
		region: "Кировская область",
		km: 32
	},
	{
		title: "деревня Слобода",
		emblem: "img/town/kir.png",
		region: "Кировская область",
		km: 47
	},
	{
		title: "село Екатерининское",
		emblem: "img/town/perm.png",
		region: "Пермский край",
		km: 40
	},
	{
		title: "посёлок Менделеево",
		emblem: "img/town/perm.png",
		region: "Пермский край",
		km: 84
	},
	{
		title: "Пермь",
		emblem: "img/town/perm.png",
		region: "Пермский край",
		km: 100
	},
	{
		title: "деревня Байболовка",
		emblem: "img/town/perm.png",
		region: "Пермский край",
		km: 56
	},
	{
		title: "Кунгур",
		emblem: "img/town/perm.png",
		region: "Пермский край",
		km: 41
	},
	{
		title: "село Брехово",
		emblem: "img/town/perm.png",
		region: "Пермский край",
		km: 69
	},
	{
		title: "деревня Тюш",
		emblem: "img/town/sve.png",
		region: "Свердловская область",
		km: 70
	},
	{
		title: "посёлок городского типа Дружинино",
		emblem: "img/town/sve.png",
		region: "Свердловская область",
		km: 84
	},
	{
		title: "Екатеринбург",
		emblem: "img/town/sve.png",
		region: "Свердловская область",
		km: 77
	},
	{
		title: "посёлок городского типа Белоярский",
		emblem: "img/town/sve.png",
		region: "Свердловская область",
		km: 55
	},
	{
		title: "Камышлов",
		emblem: "img/town/sve.png",
		region: "Свердловская область",
		km: 86
	},
	{
		title: "посёлок Троицкий",
		emblem: "img/town/sve.png",
		region: "Свердловская область",
		km: 78
	},
	{
		title: "Тюмень",
		emblem: "img/town/tyum.png",
		region: "Тюменская область",
		km: 120
	},
	{
		title: "село Старый Кавдык",
		emblem: "img/town/tyum.png",
		region: "Тюменская область",
		km: 97
	},
	{
		title: "село Омутинское",
		emblem: "img/town/tyum.png",
		region: "Тюменская область",
		km: 110
	},
	{
		title: "село Стрехнино",
		emblem: "img/town/tyum.png",
		region: "Тюменская область",
		km: 130
	},
	{
		title: "село Абатское",
		emblem: "img/town/tyum.png",
		region: "Тюменская область",
		km: 63
	},
	{
		title: "рабочий посёлок Крутинка",
		emblem: "img/town/omsk.png",
		region: "Омская область",
		km: 85
	},
	{
		title: "село Бекишево",
		emblem: "img/town/omsk.png",
		region: "Омская область",
		km: 100
	},
	{
		title: "Омск",
		emblem: "img/town/omsk.png",
		region: "Омская область",
		km: 91
	},
	{
		title: "Калачинск",
		emblem: "img/town/omsk.png",
		region: "Омская область",
		km: 88
	},
	{
		title: "Татарск",
		emblem: "img/town/novosib.png",
		region: "Новосибирская область",
		km: 100
	},
	{
		title: "аул Кошкуль",
		emblem: "img/town/novosib.png",
		region: "Новосибирская область",
		km: 97
	},
	{
		title: "Барабинск",
		emblem: "img/town/novosib.png",
		region: "Новосибирская область",
		km: 110
	},
	{
		title: "село Новоселово",
		emblem: "img/town/novosib.png",
		region: "Новосибирская область",
		km: 78
	},
	{
		title: "село Форпост-Каргат",
		emblem: "img/town/novosib.png",
		region: "Новосибирская область",
		km: 83
	},
	{
		title: "село Кабинетное",
		emblem: "img/town/novosib.png",
		region: "Новосибирская область",
		km: 70
	},
	{
		title: "Новосибирск",
		emblem: "img/town/novosib.png",
		region: "Новосибирская область",
		km: 110
	},
	{
		title: "посёлок Кошево",
		emblem: "img/town/novosib.png",
		region: "Новосибирская область",
		km: 52
	},
	{
		title: "Болотное",
		emblem: "img/town/novosib.png",
		region: "Новосибирская область",
		km: 80
	},
	{
		title: "село Топки",
		emblem: "img/town/kem.png",
		region: "Кемеровская область",
		km: 110
	},
	{
		title: "Кемерово",
		emblem: "img/town/kem.png",
		region: "Кемеровская область",
		km: 37
	},
	{
		title: "село Красный Яр",
		emblem: "img/town/kem.png",
		region: "Кемеровская область",
		km: 97
	},
	{
		title: "Мариинск",
		emblem: "img/town/kem.png",
		region: "Кемеровская область",
		km: 71
	},
	{
		title: "посёлок Нововосточный",
		emblem: "img/town/kem.png",
		region: "Кемеровская область",
		km: 55
	},
	{
		title: "Боготол",
		emblem: "img/town/kras.png",
		region: "Красноярский край",
		km: 80
	},
	{
		title: "посёлок Малиновка",
		emblem: "img/town/kras.png",
		region: "Красноярский край",
		km: 74
	},
	{
		title: "посёлок городского типа Козулька",
		emblem: "img/town/kras.png",
		region: "Красноярский край",
		km: 60
	},
	{
		title: "Красноярск",
		emblem: "img/town/kras.png",
		region: "Красноярский край",
		km: 110
	},
	//VIDEO
	{	
		title: "Уяр",
		emblem: "img/town/kras.png",
		region: "Красноярский край",
		km: 110
	},
	{	
		title: "Канск",
		emblem: "img/town/kras.png",
		region: "Красноярский край",
		km: 120
	},
	{	
		title: "посёлок Нижняя Пойма",
		emblem: "img/town/kras.png",
		region: "Красноярский край",
		km: 110
	},
	{	
		title: "посёлок Разгон",
		emblem: "img/town/irk.png",
		region: "Иркутская область",
		km: 100
	},
	{	
		title: "Нижнеудинск",
		emblem: "img/town/irk.png",
		region: "Иркутская область",
		km: 110
	},
	{	
		title: "село Котик",
		emblem: "img/town/irk.png",
		region: "Иркутская область",
		km: 130
	},
	{	
		title: "село Тулюшка",
		emblem: "img/town/irk.png",
		region: "Иркутская область",
		km: 64
	},
	{	
		title: "Зима",
		emblem: "img/town/irk.png",
		region: "Иркутская область",
		km: 95
	},
	{	
		title: "село Владимир",
		emblem: "img/town/irk.png",
		region: "Иркутская область",
		km: 80
	},
	{	
		title: "Черемхово",
		emblem: "img/town/irk.png",
		region: "Иркутская область",
		km: 55
	},
	{	
		title: "Ангарск",
		emblem: "img/town/irk.png",
		region: "Иркутская область",
		km: 97
	},
	{	
		title: "Иркутск",
		emblem: "img/town/irk.png",
		region: "Иркутская область",
		km: 49
	},
	{	
		title: "село Шаманка",
		emblem: "img/town/irk.png",
		region: "Иркутская область",
		km: 53
	},
	{	
		title: "Байкальск",
		emblem: "img/town/irk.png",
		region: "Иркутская область",
		km: 110
	},
	{	
		title: "Бабушкин",
		emblem: "img/town/bur.png",
		region: "республика Бурятия",
		km: 130
	},
	{	
		title: "село Кабанск",
		emblem: "img/town/bur.png",
		region: "республика Бурятия",
		km: 73
	},	
	{	
		title: "Улан-Удэ",
		emblem: "img/town/bur.png",
		region: "республика Бурятия",
		km: 110
	},
	{	
		title: "улус Хошун-Узур",
		emblem: "img/town/bur.png",
		region: "республика Бурятия",
		km: 86
	},
	{	
		title: "Петровск-Забайкальский",
		emblem: "img/town/zab.png",
		region: "Забайкальский край",
		km: 120
	},
	{	
		title: "село Бада",
		emblem: "img/town/zab.png",
		region: "Забайкальский край",
		km: 99
	},
	{	
		title: "село Хилогосон",
		emblem: "img/town/zab.png",
		region: "Забайкальский край",
		km: 95
	},
	{	
		title: "село Николаевское",
		emblem: "img/town/zab.png",
		region: "Забайкальский край",
		km: 100
	},
	{	
		title: "село Улёты",
		emblem: "img/town/zab.png",
		region: "Забайкальский край",
		km: 67
	},
	{	
		title: "Чита",
		emblem: "img/town/zab.png",
		region: "Забайкальский край",
		km: 110
	},
	{	
		title: "село Большая Тура",
		emblem: "img/town/zab.png",
		region: "Забайкальский край",
		km: 75
	},
	{	
		title: "село Галкино",
		emblem: "img/town/zab.png",
		region: "Забайкальский край",
		km: 98
	},
	{	
		title: "Нерчинск",
		emblem: "img/town/zab.png",
		region: "Забайкальский край",
		km: 120
	},
	{	
		title: "Сретенск",
		emblem: "img/town/zab.png",
		region: "Забайкальский край",
		km: 95
	},
	{	
		title: "посёлок городского типа Чернышевск",
		emblem: "img/town/zab.png",
		region: "Забайкальский край",
		km: 81
	},
	{	
		title: "посёлок при станции Урюм",
		emblem: "img/town/zab.png",
		region: "Забайкальский край",
		km: 130
	},
	{	
		title: "поселок городского типа Ключевский",
		emblem: "img/town/zab.png",
		region: "Забайкальский край",
		km: 140
	},
	{	
		title: "посёлок при станции Семиозёрный",
		emblem: "img/town/zab.png",
		region: "Забайкальский край",
		km: 85
	},
	{	
		title: "рабочий посёлок Ерофей Павлович",
		emblem: "img/town/amur.png",
		region: "Амурская область",
		km: 150
	},
	{	
		title: "рабочий посёлок Уруша",
		emblem: "img/town/amur.png",
		region: "Амурская область",
		km: 74
	},
	{	
		title: "Сковородино",
		emblem: "img/town/amur.png",
		region: "Амурская область",
		km: 87
	},
	{	
		title: "село Талдан",
		emblem: "img/town/amur.png",
		region: "Амурская область",
		km: 91
	},
	{	
		title: "посёлок городского типа Магдагачи",
		emblem: "img/town/amur.png",
		region: "Амурская область",
		km: 93
	},
	{	
		title: "посёлок Чалганы",
		emblem: "img/town/amur.png",
		region: "Амурская область",
		km: 98
	},
	{	
		title: "Шимановск",
		emblem: "img/town/amur.png",
		region: "Амурская область",
		km: 150
	},
	{	
		title: "село Нижние Бузули",
		emblem: "img/town/amur.png",
		region: "Амурская область",
		km: 72
	},
	{	
		title: "село Украинка",
		emblem: "img/town/amur.png",
		region: "Амурская область",
		km: 130
	},
	{	
		title: "село Знаменка",
		emblem: "img/town/amur.png",
		region: "Амурская область",
		km: 82
	},
	{	
		title: "Завитинск",
		emblem: "img/town/amur.png",
		region: "Амурская область",
		km: 85
	},
	{	
		title: "село Малиновка",
		emblem: "img/town/amur.png",
		region: "Амурская область",
		km: 70
	},
	{	
		title: "село Черноберезовка",
		emblem: "img/town/amur.png",
		region: "Амурская область",
		km: 61
	},
	{	
		title: "Облучье",
		emblem: "img/town/evr.png",
		region: "Еврейская автономная республика",
		km: 100
	},
	{	
		title: "село Будукан",
		emblem: "img/town/evr.png",
		region: "Еврейская автономная республика",
		km: 100
	},
	{	
		title: "Биробиджан",
		emblem: "img/town/evr.png",
		region: "Еврейская автономная республика",
		km: 68
	},
	{	
		title: "посёлок городского типа Смидович",
		emblem: "img/town/evr.png",
		region: "Еврейская автономная республика",
		km: 78
	},
	{	
		title: "Хабаровск",
		emblem: "img/town/hab.png",
		region: "Хабаровский край",
		km: 110
	},
	{	
		title: "рабочий посёлок Хор",
		emblem: "img/town/hab.png",
		region: "Хабаровский край",
		km: 80
	},
	{	
		title: "село Котиково",
		emblem: "img/town/hab.png",
		region: "Хабаровский край",
		km: 69
	},
	{	
		title: "посёлок городского типа Лучегорск",
		emblem: "img/town/prim.png",
		region: "Приморский край",
		km: 69
	},
	{	
		title: "Дальнереченск",
		emblem: "img/town/prim.png",
		region: "Приморский край",
		km: 84
	},
	{	
		title: "Лесозаводск",
		emblem: "img/town/prim.png",
		region: "Приморский край",
		km: 72
	},
	{	
		title: "Спасск-Дальний",
		emblem: "img/town/prim.png",
		region: "Приморский край",
		km: 140
	},
	{	
		title: "Уссурийск",
		emblem: "img/town/prim.png",
		region: "Приморский край",
		km: 130
	},
	{	
		title: "Владивосток",
		emblem: "img/town/prim.png",
		region: "Приморский край",
		km: 98
	},
	{	
		title: "село Новоникольск",
		emblem: "img/town/prim.png",
		region: "Приморский край",
		km: 110
	},
	{	
		title: "посёлок городского типа Пограничный",
		emblem: "img/town/prim.png",
		region: "Приморский край",
		km: 87
	},
	{	
		title: "город Мулэн",
		emblem: "img/town/kit.png",
		region: "Провинция Хэйлунцзян",
		km: 120
	},
	{	
		title: "городской уезд Хайлинь",
		emblem: "img/town/kit.png",
		region: "Провинция Хэйлунцзян",
		km: 88
	},
	{	
		title: "городской уезд Шанчжи",
		emblem: "img/town/kit.png",
		region: "Провинция Хэйлунцзян",
		km: 170
	},
	{	
		title: "Харбин",
		emblem: "img/town/kit.png",
		region: "Провинция Хэйлунцзян",
		km: 150
	},
	{	
		title: "поселок Ланьлин",
		emblem: "img/town/kit.png",
		region: "Провинция Хэйлунцзян",
		km: 75
	},
	{	
		title: "городской округ Сунъюань",
		emblem: "img/town/kit.png",
		region: "Провинция Гирин",
		km: 150
	},
	{	
		title: "город Чанлин",
		emblem: "img/town/kit.png",
		region: "Провинция Гирин",
		km: 180
	},
	{	
		title: "городской уезд Шуанляо",
		emblem: "img/town/kit.png",
		region: "Провинция Гирин",
		km: 140
	},
	{	
		title: "город Канпин",
		emblem: "img/town/kit.png",
		region: "Провинция Ляонин",
		km: 100
	},
	{	
		title: "город Чжанъу",
		emblem: "img/town/kit.png",
		region: "Провинция Ляонин",
		km: 90
	},
	{	
		title: "городской округ Фусинь",
		emblem: "img/town/kit.png",
		region: "Провинция Ляонин",
		km: 120
	},
	{	
		title: "городской округ Чаоян",
		emblem: "img/town/kit.png",
		region: "Провинция Ляонин",
		km: 140
	},
	{	
		title: "город Цзяньпин",
		emblem: "img/town/kit.png",
		region: "Провинция Ляонин",
		km: 78
	},
	{	
		title: "городской уезд Пинцюань",
		emblem: "img/town/kit.png",
		region: "Провинция Хэбэй",
		km: 160
	},
	{	
		title: "городской округ Чэндэ",
		emblem: "img/town/kit.png",
		region: "Провинция Хэбэй",
		km: 130
	},
	{	
		title: "Тайшитунь",
		emblem: "img/town/kit.png",
		region: "Пекин",
		km: 100
	},
	{	
		title: "Тайшитунь",
		emblem: "img/town/kit.png",
		region: "Пекин",
		km: 100
	},
	{	
		title: "Пекин",
		emblem: "img/town/kit.png",
		region: "Пекин",
		km: 110
	}
];

const signs = [
"Ограничение максимальной скорости: 30 км/ч.",
"Ограничение максимальной скорости: 60 км/ч.",
"Ограничение максимальной скорости: 90 км/ч.",
"Опасные повороты",
"Скользкая дорога",
"Неровная дорога",
"Обгон запрещен",
"Пешеходный переход",
"Железнодорожный переезд со шлагбаумом",
"Дикие животные"
];

const songs = [
	"avicii_wake_me_up",
	"keino_spirit_in_the_sky",
	"powerwolf_demons_are_a_girls_best_friend",
	"rammstein_amerika",
	"lordi_hard_rock_hallelujah",
	"the_offspring_you're_gonna_go_far_kid",
	"ozon_dragostea_din_tei",
	"andrey_grizli_counting_stars",
	"yogscast_diggy_diggy_hole",
	"little_big_uno",
	"kate_miller_heidke_zero_gravity",
	"return_of_the_warlord",
	"gamma_ray_send_me_a_sign",
	"rednex_old_pop_in_an_oak",
	"pirates_of_the_sea_wolves_of_the_sea",
	"greece_koza_mostra_feat",
	"sinplus_unbreakable",
	"sebalter_hunter_of_stars",
	"alexander_rybak_fairytale",
	"kristi_kover_vertolet",
	"vengaboys_we_like_to_party",
	"torrevado_living_in_the_shuttle",
	"taxi_girl",
	"silicon_dream_andromeda",
	"modern_talking_jet_airliner",
	"boney_m_i_see_a_boat_on_the_river",
	"avril_lavigne_sk8er_boi",
	"night_train",
	"modern_talking_locomotion_tango",
	"klabautermann",
	"modern_talking_riding_on_a_white_swan",
	"abba_eagle",
	"modern_talking_geronimos_cadillac",
	"blind_channel_dark_side",
	"daoi_freyr_10_years",
	"destiny_je_me_casse",
	"eden_set_me_free",
	"elena_tsagrinou_el_diablo",
	"fyr_flamme_ove_os_pa_hinanden",
	"go_a_shum",
	"hurricane_loco_loco",
	"jendrik_i_dont_feel_hate",
	"maneskin_zitti_e_buoni",
	"rafal_the_ride",
	"stefania_last_dance",
	"the_roop_discoteque",
	"tix_fallen_angel",
	"infernal_from_paris_to_berlin",
	"tusse_voices",
	"frederic_oddloop"
];
/* "sec" */

function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}