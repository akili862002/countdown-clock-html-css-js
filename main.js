let main_title = "Stopwatch";


function get_last_two_char(str){
    return str.substring(str.length - 2, str.length);
}

function convert_to_time_text(time) {
    let hour   = parseInt(time/3600);
    let minute = parseInt((time - hour*3600)/60);
    let second = time - hour*3600 - minute*60;
    // Convert to text
    hour   = hour.toString();
    minute = minute.toString();
    second = second.toString();

    return hour + ":" + minute + ":" + second;
}

function convert_to_second(t) {
    t = t.split(":");

    // Return to number
    //          Hour                    Minute              Second
    return Number(t[0])*3600 + Number(t[1])*60 + Number(t[2]);
}

function updateTimeSet(value) {
    let minute = value;

    if (minute >= 60) {
        let time_second = convert_to_second("0:" + minute + ":0");
        let time_converted = convert_to_time_text(time_second);

        document.querySelector(".card .time-box .input-text").value = time_converted;

    } else 
        document.querySelector(".card .time-box .input-text").value = minute.toString() + " minutes";
   
    if (value == 0) 
        document.querySelector(".card .time-box .input-text").value = "";
}

function get_value_time(setTime) {
    if (setTime.includes("minutes")) {
        let minute = setTime.split(" ")[0];
        setTime = convert_to_second("0:"+minute+":0");
        return setTime;
    } else if (parseInt(setTime) == NaN || setTime == NaN) {
        return "Invalid";
    } else {
        return convert_to_second(setTime);
    }
}


function activate(element) {
    document.querySelector(element).classList.remove("disabled");
}                        
function disabled(element) {
    document.querySelector(element).classList.add("disabled");
}
function disabled_all_button_inside_circle() {
    disabled(".card .persent .inside-circle .play-icon");
    disabled(".card .persent .inside-circle .number");
    disabled(".card .persent .inside-circle .pause-icon");
    disabled(".card .persent .inside-circle .time-out");
}

function reset_animation(element) {
    let len = element.split(" ").length;
    let last_element = element.split(" ")[len - 1];
    // by the way remove then readd this element, animation will automatically be reseted
    last_element = last_element.replace(".", "")
    $(element).removeClass(last_element).addClass(last_element);
}

function active_number_persent_inside_circle() {
    disabled_all_button_inside_circle();
    // Activate number persent----
    activate(".card .persent .inside-circle .number");
}

function Time_out_show() {
    document.title = "Time out!"
    disabled_all_button_inside_circle();
    // activate Shake Hourglass premium
    activate(".card .persent .inside-circle .time-out")
    document.querySelector(".card .persent svg.circle circle").style.stroke = "rgb(197, 18, 100)"
    
    // Play ring sound
    document.querySelector(".ring-sound").play()
}

function reset_animation_of_circle() {
    let element = document.querySelector(".card .persent circle");
    element.classList.remove("animation");
    void element.offsetWidth; // trigger a DOM reflow
    element.classList.add("animation");
}

function resetCountdown() {
    document.title = main_title;
    disabled_all_button_inside_circle();
    activate(".card .persent .inside-circle .play-icon");
    document.querySelector(".card .persent svg.circle circle").style.stroke = "rgb(11, 181, 142)"
    reset_animation_of_circle();
    document.querySelector(".card .time-box .input-text").value = '';
}




let time_remain, setTime;
let isCountdowning = false;
let countdown;
function startCountdown() {
    console.log("Start");
    setTime = document.querySelector(".card .time-box .input-text").value;
    setTime = get_value_time(setTime); // set-time is seconds
    console.log(setTime);

    // Disable something
    document.querySelector(".card .time-box .input-range").disabled = true;

    // Start countDown
    if (setTime !== "Invalid" || setTime != NaN) {
        
        active_number_persent_inside_circle();
        time_remain = setTime;

        if (isCountdowning)  // Clear any coundown is working
            clearInterval(countdown);

        countdown = setInterval(function() {
            isCountdowning = true;
            time_remain -= 0.05; // Each second, we decrease time remain
            time_remain = Number(time_remain.toFixed(2));
            // console.log(time_remain);

            // if (time_remain == 0.5) document.querySelector(".ring-sound-1").play();
            if (time_remain == Number((setTime/2).toFixed(2))) {
                document.querySelector(".half-time-sound").volume = 1;
                document.querySelector(".half-time-sound").play();
            }

            if (time_remain > 0) {               
                let persent = (time_remain/setTime)*100;       
                // update time to screen -- 
                //     - Time remain
                document.querySelector(".card .time-box .input-text").value = convert_to_time_text(Math.floor(time_remain));
                document.querySelector(".card .persent .inside-circle .number ").innerHTML = parseInt(persent) + "<span>%<span>";
                document.title = convert_to_time_text(Math.floor(time_remain));
                //     - Circle persent 
                 
                let dashoffset = (503 - ((persent)*503)/100).toString();
                // console.log(dashoffset);
                document.querySelector(".card .persent .circle circle").style.strokeDashoffset = dashoffset;
            } else {
                console.log("Stop countdown!")
                clearInterval(countdown);
                isCountdowning = false;
                // reset
                Time_out_show();
                document.querySelector(".card .time-box .input-text").value = "0:0:0";
                document.querySelector(".card .time-box .input-range").disabled = false;
                document.querySelector(".card .persent .circle circle").style.strokeDashoffset = 0;
            }
            
        }, 50)
    }
}