let save = false;
let testMode = false;
let currentLocation = 0; //42

let speed = 45;
let currentBenzin = 200;
let money = 10000;
let karma = 0;

let day = false;
let date = 1;
let hour = 9;
let minute = 30;

let isGameOver = false;
let hint = 0;
let originalBenzinPrice = 49;
let originalUpgradePrice = 5000;
let originalFoodPrice = 1500;
let benzinPrice = 49;
let benzinOverallCost = 0;
let foodPrice = 1500;
let upgradePrice = 5000;
let karmaDiscount = 0;
let karmaLevel = 0;
let karmaNextLevel = 5;
let kmToPekin = 12278;
let tank = 200;
let creditLimit = -20000;

let currentSong = 0;
let currentQuest = 0;
let rashodBenzina = 0.15;
let rashodLitrov = 1;
let currentHour = 0;
let currentMinute = 0;
let currentKM = 28;
let distanceMultiplier = 1;
let destination = null;

let loto_count = 0;
let win_count = 0;
let loto_tickets = 5;
let loto_tickets_max = 5;

let loto_wins = [];
let loto_rolls = [];
let loto_wins_str = '';
let loto_rolls_str = '';
let hourInterval = null;
let minuteInterval = null;
let benzinUsing = null;

function load(){
	shuffle(songs);
	shuffle(quests);
	if(localStorage.getItem('save') === 'true'){
		$('#rout').hide();
		loadFromStorage();
		adjustLocation();
		mirror('Вы сейчас находитесь в локации: ' + locations[currentLocation].title + '. Хотите продолжить путь?');
	} else {
		mirror('Итак, большое путешествие из Петербурга в Китай начинается. Вы садитесь в ваш автомобиль и, улыбнувшись, давите на газ!');
		load_loto();
		checkMoney(money);
		$('#speed').html(speed);
		$('#benzin').html(currentBenzin);
		$('#karma').html(karma);
		$('#date').html(date);
		$('#hour').html(hour);
		$('#minute').html(minute);
		$('#km').html(kmToPekin);
	}
}

function salut(){
	// mirror('Вот и Пекин, сердце Поднебесной. Салют знаменует окончание автомобильного приключения. Как говорят в Испании, "Buen Camino!" = "Доброго Пути!"', 5, 'red');
	mirror('Вот и Пекин, сердце Поднебесной. Салют знаменует окончание автомобильного приключения. Всего было потрачено на бензин: ' + benzinOverallCost + ' руб.', 5, 'red');
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
	/* $('#saveGame').toggle(); */
}

function newGame()
{
	localStorage.clear();
	window.location.reload();
}

function saveGame()
{
	localStorage.setItem('save', 'true');
	localStorage.setItem('currentLocation', currentLocation);
	localStorage.setItem('speed', speed);
	localStorage.setItem('currentBenzin', currentBenzin);
	localStorage.setItem('money', money);
	localStorage.setItem('karma', karma);
	localStorage.setItem('day', day);
	localStorage.setItem('date', date);
	localStorage.setItem('hour', hour);
	localStorage.setItem('minute', minute);
	localStorage.setItem('isGameOver', isGameOver);
	localStorage.setItem('hint', hint);
	localStorage.setItem('originalBenzinPrice', originalBenzinPrice);
	localStorage.setItem('originalUpgradePrice', originalUpgradePrice);
	localStorage.setItem('originalFoodPrice', originalFoodPrice);
	localStorage.setItem('benzinPrice', benzinPrice);
	localStorage.setItem('benzinOverallCost', benzinOverallCost);
	localStorage.setItem('foodPrice', foodPrice);
	localStorage.setItem('upgradePrice', upgradePrice);
	localStorage.setItem('karmaDiscount', karmaDiscount);
	localStorage.setItem('karmaLevel', karmaLevel);
	localStorage.setItem('karmaNextLevel', karmaNextLevel);
	localStorage.setItem('kmToPekin', kmToPekin);
	localStorage.setItem('tank', tank);
	localStorage.setItem('creditLimit', creditLimit);
	localStorage.setItem('currentSong', currentSong);
	localStorage.setItem('currentQuest', currentQuest);
	localStorage.setItem('rashodBenzina', rashodBenzina);
	localStorage.setItem('currentHour', currentHour);
	localStorage.setItem('currentMinute', currentMinute);
	localStorage.setItem('currentKM', currentKM);
	localStorage.setItem('distanceMultiplier', distanceMultiplier);
	localStorage.setItem('destination', destination);
	localStorage.setItem('loto_count', loto_count);
	localStorage.setItem('win_count', win_count);
	localStorage.setItem('loto_tickets', loto_tickets);
	localStorage.setItem('loto_tickets_max', loto_tickets_max);
	localStorage.setItem('loto_wins_str', loto_wins.join(' '));
	localStorage.setItem('loto_rolls_str', loto_rolls.join(' '));
}

function loadFromStorage()
{
	save = true;
	rashodLitrov = Math.floor(currentKM * rashodBenzina);
	currentLocation = parseInt(localStorage.getItem('currentLocation'));
	speed = parseInt(localStorage.getItem('speed'));
	$('#speed').html(speed);
	currentBenzin = parseInt(localStorage.getItem('currentBenzin'));
	checkBenzin();
	$('#benzin').html(currentBenzin);
	money = parseInt(localStorage.getItem('money'));
	checkMoney();
	$('#money').html(money);
	karma = parseInt(localStorage.getItem('karma'));
	$('#karma').html(karma);
	kmToPekin = parseInt(localStorage.getItem('kmToPekin'));
	$('#km').html(kmToPekin);
	currentKM = parseInt(localStorage.getItem('currentKM'));
	rashodBenzina = parseFloat(localStorage.getItem('rashodBenzina'));
	tank = parseInt(localStorage.getItem('tank'));
	$('#tank').html(tank);
	day = localStorage.getItem('day') === 'true';
	date = parseInt(localStorage.getItem('date'));
	$('#day').html(date);
	hour = parseInt(localStorage.getItem('hour'));
	$('#hour').html(hour);
	minute = parseInt(localStorage.getItem('minute'));
	$('#minute').html(minute);
	isGameOver = localStorage.getItem('isGameOver') === 'true';
	hint = parseInt(localStorage.getItem('hint'));
	originalBenzinPrice = parseInt(localStorage.getItem('originalBenzinPrice'));
	originalUpgradePrice = parseInt(localStorage.getItem('originalUpgradePrice'));
	originalFoodPrice = parseInt(localStorage.getItem('originalFoodPrice'));
	benzinPrice = parseInt(localStorage.getItem('benzinPrice'));
	benzinOverallCost = parseInt(localStorage.getItem('benzinOverallCost'));
	foodPrice = parseInt(localStorage.getItem('foodPrice'));
	upgradePrice = parseInt(localStorage.getItem('upgradePrice'));
	karmaDiscount = parseInt(localStorage.getItem('karmaDiscount'));
	karmaLevel = parseInt(localStorage.getItem('karmaLevel'));
	karmaNextLevel = parseInt(localStorage.getItem('karmaNextLevel'));
	creditLimit = parseInt(localStorage.getItem('creditLimit'));
	currentSong = parseInt(localStorage.getItem('currentSong'));
	currentQuest = parseInt(localStorage.getItem('currentQuest'));
	currentHour = parseInt(localStorage.getItem('currentHour'));
	currentMinute = parseInt(localStorage.getItem('currentMinute'));
	distanceMultiplier = parseInt(localStorage.getItem('distanceMultiplier'));
	destination = parseInt(localStorage.getItem('destination'));
	loto_count = parseInt(localStorage.getItem('loto_count'));
	win_count = parseInt(localStorage.getItem('win_count'));
	loto_tickets = parseInt(localStorage.getItem('loto_tickets'));
	loto_tickets_max = parseInt(localStorage.getItem('loto_tickets_max'));
	loto_wins = localStorage.getItem('loto_wins_str').split(' ');
	loto_rolls = localStorage.getItem('loto_rolls_str').split(' ');
	load_loto_from_storage();
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

function load_loto_from_storage(){
	for(let i = 1; i <= 15; i++){
		$('#loto_' + i).html(loto_wins[i-1]);
	}
	//Mark green the winning numbers
	loto_wins.filter(value => loto_rolls.includes(value)).forEach(windex => $('#loto_' + (loto_wins.indexOf(windex)+1)).addClass('loto_win'));
}

function roll_loto(){
	if(loto_tickets == 0){
		mirror('Извините, лотерейные билеты закончились. Попробуйте заехать в киоск Авто-Лото в другом городе!', 20, 'red');
		$('#loto').prop('disabled', true);
	} else {
		loto_tickets--;
		money -= 49;
		checkMoney(money);
		let num = roll_loto_random();
		loto_rolls.push(num);
		mirror('Выпало число... ' + num + '. Открыто цифр: ' + loto_rolls.length + ' из 99. Угадано выигрышных цифр: ' 
		+ win_count + ' из 15. Осталось билетов: ' + loto_tickets, 20, 'green');
		if(loto_wins.includes(num)){
			win_count++;
			let bonus = (1000 * win_count * 1.5);
			money += bonus;
			mirror('Выпало число... ' + num + '. Поздравляем! Вы открыли ' + win_count + ' цифру в Авто-Лото и выиграли ' + bonus + ' руб!', 20, 'red');
			checkMoney(money);
			$('#loto_' + (loto_wins.indexOf(num)+1)).addClass('loto_win');
		}
	}
	saveGame();
}

function clean_loto(){
	loto_tickets = loto_tickets_max + (karmaLevel/5) * 2;
	$('#loto').hide();
	$('#loto').prop('disabled', false);
}

function open_loto(add){
	currentQuest += add;
	$('#action_1').hide();
	$('#action_2').hide();
	$('#loto').show();
	$('#start').prop('disabled', false);
	mirror('Вы можете приобрести до ' + loto_tickets_max 
	+ ' лотерейных билетов по 49 руб за штуку. Кликните на любую клетку лотерейного бланка.');
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
	if(hint<hints.length){
		mirror(hints[hint].txt, 20, hints[hint++].color);
	} else {		
		$('#rout').hide();
		$('#discount').hide();
		$('#start').prop('disabled', true);
		$('#car').show();
		clean_loto();
		mirror('...wroom wroom wroom...', 5, 'blue');
		playRoadSong();
	}
}

let hints = [
	{
		txt: 'Помните, что Ваш нижний лимит по кредитной карте: ' + creditLimit + ' руб.',
		color: 'red'
	},
	{
		txt: 'Каждые сутки в случае отрицательной суммы денег на счету с Вас будут сниматься проценты по кредиту в размере 500 руб.',
		color: 'red'
	},
	{
		txt: 'Каждые сутки Вы тратите ' + foodPrice + ' руб на питание.',
		color: 'blue'
	},
	{
		txt: 'Каждые 5 Кармы Вы получаете соответствующую 5%/10%/15%/../50% скидку на бензин, питание, прокачку машины и дополнительные лотерейные билеты.',
		color: 'green'
	}
];

function mirror(txt, speed, color){
$( "#mirror_txt" ).replaceWith( '<marquee id="mirror_txt" class="font text-center align-middle ' + color + '" direction="up" scrolldelay="1" scrollamount="' + speed + '" behavior="slide"><font id="road_text">' + txt + '</font></marquee>' );
}

function arrive(){
	currentLocation++;
	currentKM = locations[currentLocation].km;
	calculateKM();
	calculateRoadTime();
	if(currentLocation>=locations.length-1){
		salut();
	} else {	
		$("#car").attr("src", "video/rout/" + locations[currentLocation].video + ".mp4");
	}
}

function arriveText(){
	if(currentLocation<locations.length-1 && !isGameOver){
		adjustLocation();
		$('#start').prop('disabled', true);
		deliver();
	}
}

function adjustLocation(){
	if(currentLocation<locations.length-1 && !isGameOver){
		$('#next_km').html(locations[currentLocation+1].km);
		$('#next_l').html(Math.floor(locations[currentLocation+1].km*rashodBenzina));
		$('#town_title').html(locations[currentLocation].title);
		$("#emblem").attr("src", locations[currentLocation].emblem);
		$('#region').html(locations[currentLocation].region);
		$("#car").attr("src", "video/rout/" + locations[currentLocation].video + ".mp4");
	}
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
		$('#action_2').attr("src", quests[currentQuest+1].questImg);
		$('#action_2').attr("onclick", quests[currentQuest+1].questMethod + "(1)");
		text_2 = quests[currentQuest+1].questText;
	}
	$('#action_1').show();
	$('#action_2').show();
	mirror("Вы можете " + text_1 + " или " + text_2 + ".");
}

let quests = [
		{
			questText: 'прокачать вашу "тачку" (Стоимость: 5000 руб)',
			questResult: "",
			questImg: "img/upgrade.jpg",
			questSong: "",
			questVideo: "",
			questMethod: "upgrade"
		},
		{
			questText: "взять посылку в другой город (Заработок: от 4000 руб)",
			questResult: "",
			questImg: "img/postel.jpg",
			questSong: "",
			questVideo: "",
			questMethod: "postel"
		},
		{
			questText: "сыграть в Авто-Лото (Выигрыш: от 1500 руб)",
			questResult: "",
			questImg: "img/loto.jpg",
			questSong: "",
			questVideo: "",
			questMethod: "open_loto"
		},
		{
			questText: "помочь перевезти книги для районной библиотеки (+Карма)",
			questResult: "Вы помогли перевезти школьную литературу. Ваша карма улучшилась: +",
			questImg: "img/quest/knigi.jpg",
			questSong: "kant",
			questVideo: "video/quest/library.mp4",
			questMethod: "quest",
			karma: true
		},
		{
			questText: "помочь жениху и невесте успеть на свадьбу (+Карма)",
			questResult: "Вы помогли жениху и невесте добраться до церкви. Ваша карма улучшилась: +",
			questImg: "img/quest/wedding.jpg",
			questSong: "wedding",
			questVideo: "video/quest/wedding.mp4",
			questMethod: "quest",
			karma: true
		},
		{
			questText: "помочь дедушке отвезти тыкву на ярмарку (Заработок: от 3000 руб)",
			questResult: "Вы помогли дедушке выиграть приз за самую крупную тыкву и получили от него небольшую благодарность: ",
			questImg: "img/quest/pumpkin.jpg",
			questSong: "popcorn",
			questVideo: "video/quest/pumpkin.mp4",
			questMethod: "quest",
			karma: false
		},
		{
			questText: "помочь с переездом многодетной семье (Заработок: от 3000 руб)",
			questResult: "Вы помогли семье отвезти вещи в новый дом и получили от них небольшую благодарность: ",
			questImg: "img/quest/pereezd.jpg",
			questSong: "family",
			questVideo: "video/quest/family.mp4",
			questMethod: "quest",
			karma: false
		},
		{
			questText: "помочь туристам найти их гостиницу (Заработок: от 3000 руб)",
			questResult: "Вы отвезли туристов в их отель и получили от них небольшую благодарность: ",
			questImg: "img/quest/tourist.jpeg",
			questSong: "Verona",
			questVideo: "video/quest/tourist.mp4",
			questMethod: "quest",
			karma: false
		},
		{
			questText: "помочь танцорам добраться до исторического бала (+Карма)",
			questResult: "Вы подвезли танцоров к порогу танцевального зала, чтобы они успели на полонез. Ваша карма улучшилась: +",
			questImg: "img/quest/dancers.jpeg",
			questSong: "Fledermaus",
			questVideo: "video/quest/dancers.mp4",
			questMethod: "quest",
			karma: true
		},
		{
			questText: "помочь студентам успеть на пару (+Карма)",
			questResult: "Вы подвезли студентов к университету. Ваша карма улучшилась: +",
			questImg: "img/quest/student.jpg",
			questSong: "studenty",
			questVideo: "video/quest/studenty.mp4",
			questMethod: "quest",
			karma: true
		},
		{
			questText: "помочь бабушке сбежать от погони (Заработок: от 10 000 руб. Карма: -2)",
			questResult:'"Спасибо, милок" - говорит бабушка, когда хвост отстал, и вы получаете от неё небольшую благодарность: ',
			questImg: "img/quest/babushka.jpg",
			questSong: "Ma Baker",
			questVideo: "video/quest/money.mp4",
			questMethod: "quest",
			karma: false,
			antikarma: true
		},
		{
			questText: "помочь потерявшемуся мальчику вернуться домой (+Карма)",
			questResult:'Вы возвращаете ребёнка перепуганным родителям. Ваша карма улучшилась: +',
			questImg: "img/quest/boy.jpg",
			questSong: "boy",
			questVideo: "video/quest/boy.mp4",
			questMethod: "quest",
			karma: true
		},
		{
			questText: "отвезти домой потерявшегося котёнка (+Карма)",
			questResult:'Вы возвращаете котёнка обеспокоенной хозяйке. Ваша карма улучшилась: +',
			questImg: "img/quest/cat.jpg",
			questSong: "cat",
			questVideo: "video/quest/cat.mp4",
			questMethod: "quest",
			karma: true
		},
		{
			questText: "помочь перевезти айтишнику оборудование (Заработок: от 3000 руб)",
			questResult:'Вы помогли айтишнику отвезти "железо" и получили от него небольшую благодарность: ',
			questImg: "img/quest/it.jpg",
			questSong: "it",
			questVideo: "video/quest/it.mp4",
			questMethod: "quest",
			karma: false
		}
];

function quest(add){
	currentQuest += add;
	let txt = quests[currentQuest].questResult;
	calculateTime(120);
	$('#action_1').hide();
	$('#action_2').hide();
	$('#quest').attr("src", quests[currentQuest].questVideo);
	$('#quest').show();
	playQuestSong(quests[currentQuest].questSong);
	if(quests[currentQuest].karma){
		let plusKarma = getRandomInt(1,3);
		txt+=plusKarma;
		karma+=plusKarma;
		$('#karma').html(karma);
	} else {
		if(quests[currentQuest].antikarma){
			money += 10000;
			txt+='10000 руб.';
			checkMoney(money);
			karma-=2;
			$('#karma').html(karma);
		} else {
			let sum = 3000 + 100*karma;
			money += sum;
			txt+=sum + ' руб.';
			checkMoney(money);
		}
	}
	mirror(txt, 10, 'green');
}

function checkMoney(money){
	if(money<=0){
		$('#money').removeClass("green");
		$('#money').addClass("red");
	} else {
		$('#money').removeClass("red");
		$('#money').addClass("green");
	}
	$('#money').html(money);
}

function checkKarma(){
	if(karma > karmaLevel && karma >= karmaNextLevel) {
		karmaLevel = karmaNextLevel;
		karmaNextLevel += 5;
		karmaDiscount = karmaLevel;
		benzinPrice = Math.floor(originalBenzinPrice - (originalBenzinPrice * karmaDiscount/100));
		upgradePrice = Math.floor(originalUpgradePrice - (originalUpgradePrice * karmaDiscount/100));
		foodPrice = Math.floor(originalFoodPrice - (originalFoodPrice * karmaDiscount/100));
		$('#discount').attr("src", "img/karma/karma_" + karmaLevel + ".jpg");
		$('#discount').show();
	}
}

function playQuestSong(song){
	let name = "audio/quest/" + song + ".mp3";
	let action = function() {
		$('#quest').hide();
		checkKarma();
		saveGame();
		$('#start').prop('disabled', false);
	};
	playAudio(name,action);
}

function playAudio(name,action){
	if(testMode) name = "audio/sec.mp3";
	let audio = new Audio(name);
	audio.play();
	audio.onended = action;
}


function nextQuest(){
	currentQuest+=2;
	if(currentQuest >= quests.length-1){
		shuffle(quests);
		if(destination != null){
			//Push "postel" to end of quests
			quests.push(quests.splice(findIndexByKeyValue(quests,"questMethod","postel"), 1)[0]);
		}
		currentQuest = 0;
	}
}

function findIndexByKeyValue(array, key, value) {
    for (var i = 0; i < array.length; i++) {
		if (array[i][key] == value) {
			return i;
		}
    }
    return null;
}

function endActivity(){
	$('#action_1').hide();
	$('#action_2').hide();
	saveGame();
	$('#start').prop('disabled', false);
}

function gasoline(){
	let litr = tank - currentBenzin;
	let sum = Math.floor(litr * benzinPrice);
	currentBenzin = tank;
	 $('#benzin').html(currentBenzin);
	$('#benzin_img').attr("src","img/benzin_green.png");
	money -= sum;
	checkMoney(money);
	mirror("Вы заплатили за " + litr + " л " + sum + " руб.");
	benzinOverallCost += sum;
	endActivity();
}

function upgrade(add){
	currentQuest += add;
	money -= upgradePrice;
	checkMoney(money);
	tank+=50;
	$('#tank').html(tank);
	speed+=15;
	$('#speed').html(speed);
	mirror('Вам "прокачали" вашу тачку за ' + upgradePrice + ' руб, увеличив её скорость (+15 км/ч) и объём топливного бака (+50 л).');
	endActivity();
}

function postel(add){
	currentQuest += add;
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
		let bonus = 2000 * distanceMultiplier;
		money += bonus;
		checkMoney(money);
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
		 nextDate();
	   }
	   $('#hour').html(hour);
	} else {
		 clearInterval(hourInterval);
		 checkSun();
	}
}

function nextDate(){
	var dayCost = "За прошедшие сутки на питание ушло " + foodPrice + " руб.";
	hour = 0;
	$('#day').html(++date);
	money -= foodPrice;
	if(money<0){
		money -= 500;
		dayCost += " Из-за отрицательного баланса на счету сняты проценты по кредиту: 500 руб."
	}
	if(currentBenzin <= 0){
		dayCost += baryga();
	}
	if(money<creditLimit){
		dayCost = gameover();
	}
	checkMoney(money);
	mirror(dayCost, 20, 'red');
}

function gameover(){
	isGameOver = true;
	$('#event').attr("onclick", "#");
	$('#action_1').hide();
	$('#action_2').hide();
	$('#start').prop('disabled', true);
	$('#event').attr("src","img/gameover.jpg");
	$('#event').show();
	return "Денег стало меньше кредитного лимита. К сожалению, Вы не можете дальше никуда ехать!";
}

function countMinute(){
	if(currentMinute > 0) {
	   currentMinute--;
	   minute++;
	   if(minute == 60){
		 minute = 0;
		 hour++;
		  if(hour == 24){
			 nextDate();
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
		  mirror("Вcё приехали... Мотор заглох." + baryga());
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

function baryga(){
	return " Бензин на нуле. Придётся брать по двойной стоимости у дорожного барыги.";
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
	checkMoney(money);
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

function playRoadSong(){
	let song = "audio/" + songs[currentSong] + ".mp3";
	let action = function() {
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
	playAudio(song,action);
}



const locations = [
	{
		title: "Санкт-Петербург",
		emblem: "img/town/spb.png",
		region: "Северная Столица",
		km: 0,
		video: "1.Sankt-Peterburg"
	},
	{
		title: "деревня Разметелево",
		emblem: "img/town/len.jpg",
		region: "Ленинградская область",
		km: 28,
		video: "2.Razmetelevo"
	},
	{
		title: "Шлиссельбург",
		emblem: "img/town/len.jpg",
		region: "Ленинградская область",
		km: 28,
		video: "3.Shlisselburg"
	},
	{
		title: "Сясьстрой",
		emblem: "img/town/len.jpg",
		region: "Ленинградская область",
		km: 99,
		video: "4.Syastroy"
	},
	{
		title: "Тихвин",
		emblem: "img/town/len.jpg",
		region: "Ленинградская область",
		km: 95,
		video: "5.Tichvin"
	},
	{
		title: "Пикалёво",
		emblem: "img/town/len.jpg",
		region: "Ленинградская область",
		km: 277,
		video: "6.Pikalevo"
	},
	{
		title: "Череповец",
		emblem: "img/town/vol.png",
		region: "Вологодская область",
		km: 320,
		video: "7.Cherepovets"
	},
	{
		title: "Буй",
		emblem: "img/town/kos.png",
		region: "Костромская область",
		km: 340,
		video: "8.Buj"
	},
	{
		title: "Шарья",
		emblem: "img/town/kos.png",
		region: "Костромская область",
		km: 176,
		video: "9.Sharia"
	},
	{
		title: "Котельнич",
		emblem: "img/town/kir.png",
		region: "Кировская область",
		km: 80,
		video: "10.Kotelnich"
	},
	{
		title: "Киров",
		emblem: "img/town/kir.png",
		region: "Кировская область",
		km: 234,
		video: "11.Kirov"
	},
	{
		title: "Глазов",
		emblem: "img/town/kir.png",
		region: "Кировская область",
		km: 330,
		video: "12.Glazov"
	},
	{
		title: "Пермь",
		emblem: "img/town/perm.png",
		region: "Пермский край",
		km: 216,
		video: "13.Perm"
	},
	{
		title: "деревня Тюш",
		emblem: "img/town/sve.png",
		region: "Свердловская область",
		km: 148,
		video: "14.Tyush"
	},
	{
		title: "Екатеринбург",
		emblem: "img/town/sve.png",
		region: "Свердловская область",
		km: 140,
		video: "15.Ekaterinburg"
	},
	{
		title: "Камышлов",
		emblem: "img/town/sve.png",
		region: "Свердловская область",
		km: 187,
		video: "16.Kamyshlov"
	},
	{
		title: "Тюмень",
		emblem: "img/town/tyum.png",
		region: "Тюменская область",
		km: 360,
		video: "17.Tjumen"
	},
	{
		title: "село Абатское",
		emblem: "img/town/tyum.png",
		region: "Тюменская область",
		km: 297,
		video: "18.Abbatskoe"
	},
	{
		title: "Омск",
		emblem: "img/town/omsk.png",
		region: "Омская область",
		km: 350,
		video: "19.Omsk"
	},
	{
		title: "Куйбышев",
		emblem: "img/town/novosib.png",
		region: "Новосибирская область",
		km: 330,
		video: "20.Kujbyshev"
	},
	{
		title: "Новосибирск",
		emblem: "img/town/novosib.png",
		region: "Новосибирская область",
		km: 271,
		video: "21.Novosibirsk"
	},
	{
		title: "Кемерово",
		emblem: "img/town/kem.png",
		region: "Кемеровская область",
		km: 420,
		video: "22.Kemerovo"
	},
	{
		title: "посёлок городского типа Козулька",
		emblem: "img/town/kras.png",
		region: "Красноярский край",
		km: 60,
		video: "23.Kozulka"
	},
	{
		title: "Красноярск",
		emblem: "img/town/kras.png",
		region: "Красноярский край",
		km: 430,
		video: "24.Krasnojarsk"
	},
	//VIDEO
	{	
		title: "посёлок Разгон",
		emblem: "img/town/irk.png",
		region: "Иркутская область",
		km: 247,
		video: "25.Razgon"
	},
	{	
		title: "село Котик",
		emblem: "img/town/irk.png",
		region: "Иркутская область",
		km: 420,
		video: "26.Kotik"
	},
	{	
		title: "Иркутск",
		emblem: "img/town/irk.png",
		region: "Иркутская область",
		km: 450,
		video: "27.Irkutsk"
	},
	{	
		title: "Улан-Удэ",
		emblem: "img/town/bur.png",
		region: "республика Бурятия",
		km: 152,
		video: "28.Ulan-Ude"
	},
	{	
		title: "Петровск-Забайкальский",
		emblem: "img/town/zab.png",
		region: "Забайкальский край",
		km: 460,
		video: "29.Petrovsk-Zabajkalskii"
	},
	{	
		title: "Чита",
		emblem: "img/town/zab.png",
		region: "Забайкальский край",
		km: 430,
		video: "30.Chita"
	},
	{	
		title: "посёлок при станции Урюм",
		emblem: "img/town/zab.png",
		region: "Забайкальский край",
		km: 370,
		video: "31.Urjum"
	},
	{	
		title: "рабочий посёлок Ерофей Павлович",
		emblem: "img/town/amur.png",
		region: "Амурская область",
		km: 600,
		video: "32.Erofej-Pavlovich"
	},
	{	
		title: "село Нижние Бузули",
		emblem: "img/town/amur.png",
		region: "Амурская область",
		km: 570,
		video: "33.Nizhnie-Buzuli"
	},
	{	
		title: "Биробиджан",
		emblem: "img/town/evr.png",
		region: "Еврейская автономная республика",
		km: 188,
		video: "34.Birobidzhan"
	},
	{	
		title: "Хабаровск",
		emblem: "img/town/hab.png",
		region: "Хабаровский край",
		km: 145,
		video: "35.Habarovsk"
	},
	{	
		title: "село Котиково",
		emblem: "img/town/hab.png",
		region: "Хабаровский край",
		km: 520,
		video: "36.Kotikovo"
	},
	{	
		title: "Уссурийск",
		emblem: "img/town/prim.png",
		region: "Приморский край",
		km: 130,
		video: "37.Ussurijsk"
	},
	{	
		title: "Владивосток",
		emblem: "img/town/prim.png",
		region: "Приморский край",
		km: 310,
		video: "38.Vladivostok"
	},
	{	
		title: "город Мулэн",
		emblem: "img/town/kit.png",
		region: "Провинция Хэйлунцзян",
		km: 400,
		video: "39.Mulen"
	},
	{	
		title: "Харбин",
		emblem: "img/town/kit.png",
		region: "Провинция Хэйлунцзян",
		km: 550,
		video: "40.Harbin"
	},
	{	
		title: "город Чжанъу",
		emblem: "img/town/kit.png",
		region: "Провинция Ляонин",
		km: 460,
		video: "41.Chzhanu"
	},
	{	
		title: "городской уезд Пинцюань",
		emblem: "img/town/kit.png",
		region: "Провинция Хэбэй",
		km: 330,
		video: "42.Pinzjuan"
	},
	{	
		title: "Пекин",
		emblem: "img/town/kit.png",
		region: "Пекин",
		km: 330,
		video: "43.Pekin"
	}
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
