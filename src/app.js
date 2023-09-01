const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

function calculateTimeToNext(targetDay, targetHour, daysToAdd = 0) {
  const local = new Date().toLocaleString("en-US", {timeZone: "Europe/Oslo"})
  const now = new Date(local);
  let targetDate = new Date(now);

  const currentDay = now.getDay();
  const daysUntilTarget = (targetDay + 7 - currentDay) % 7;

  if (daysUntilTarget === 0 && now.getHours() >= targetHour) {
    daysToAdd += 7;
  }

  targetDate.setDate(targetDate.getDate() + daysUntilTarget + daysToAdd);
  targetDate.setHours(targetHour, 0, 0, 0);

  const timeDifference = targetDate - now;
  return timeDifference;
}

let heroTitle = 'Hold ut!';

function getCurrentMessage() {
  const local = new Date().toLocaleString("en-US", {timeZone: "Europe/Oslo"})
  const now = new Date(local);
  const currentDay = now.getDay();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentSecond = now.getSeconds();
  //console.log(currentHour);

  /* Test
  const now = new Date();
  const currentDay = now.getDay();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentSecond = now.getSeconds();
  END TEST */

  const weekDoneMessage = 'Påtide å bevege seg hjemover nå! 😴';
  const nightMessage = 'Du burde sove nå 😴';

  function messageOutput(getCurrentDay, getHoursLeft, getMinutesLeft, getSecondsLeft) {
    let dayOutput = 'til klokken er 16:00.';
    let hoursOutput = '';
    let minutesOutput = '';
    let secondsOutput = '';

    if (getHoursLeft === 1) {
      hoursOutput = getHoursLeft + ` time,`;
    } else if (getHoursLeft != 0) {
      hoursOutput = getHoursLeft + ` timer,`;
    }

    if (getMinutesLeft === 1) {
      minutesOutput = getMinutesLeft + ` minutt,`;
    } else if (getMinutesLeft != 0) {
      minutesOutput = getMinutesLeft + ` minutter,`;
    }

    if (getSecondsLeft === 1) {
      secondsOutput = getSecondsLeft + ` sekund`;
    } else if (getSecondsLeft != 0) {
      secondsOutput = getSecondsLeft + ` sekunder`;
    } else {
      secondsOutput = `0 sekunder`;
    }

    if (getCurrentDay === 5) {
      dayOutput = 'til helg 🍾'
    }

    if (getCurrentDay === 3) {
      dayOutput = 'til det er lillelørdag 🥳'
    }

    return `Det er bare ${hoursOutput} ${minutesOutput} ${secondsOutput} ${dayOutput}`;
  }

  if (currentDay === 1) { // Mandag
    if (currentHour < 6) {
      return nightMessage;
    } else if (currentHour >= 6 && currentHour < 16) {
      const hoursLeft = 15 - currentHour;
      const minutesLeft = 59 - currentMinute;
      const secondsLeft = 59 - currentSecond;
      return messageOutput(currentDay, hoursLeft, minutesLeft, secondsLeft);
    } else {
      return weekDoneMessage;
    }
  } else if (currentDay === 2) { // Tirsdag
    if (currentHour < 6) {
      return nightMessage;
    } else if (currentHour >= 6 && currentHour < 16) {
      const hoursLeft = 15 - currentHour;
      const minutesLeft = 59 - currentMinute;
      const secondsLeft = 59 - currentSecond;
      return messageOutput(currentDay, hoursLeft, minutesLeft, secondsLeft);
    } else {
      return weekDoneMessage;
    }
  } else if (currentDay === 3) { // Onsdag
    if (currentHour < 6) {
      return nightMessage;
    } else if (currentHour >= 6 && currentHour < 16) {
      const hoursLeft = 15 - currentHour;
      const minutesLeft = 59 - currentMinute;
      const secondsLeft = 59 - currentSecond;
      return messageOutput(currentDay, hoursLeft, minutesLeft, secondsLeft);
    } else {
      return weekDoneMessage;
    }
  } else if (currentDay === 4) { // Torsdag
    if (currentHour < 6) {
      return nightMessage;
    } else if (currentHour >= 6 && currentHour < 16) {
      const hoursLeft = 15 - currentHour;
      const minutesLeft = 59 - currentMinute;
      const secondsLeft = 59 - currentSecond;
      heroTitle = 'Veldig nære!';
      return messageOutput(currentDay, hoursLeft, minutesLeft, secondsLeft);
    } else {
      return weekDoneMessage;
    }
  } else if (currentDay === 5) { // Fredag
    if (currentHour < 6) {
      return nightMessage;
    } else if (currentHour >= 6 && currentHour < 16) {
      const hoursLeft = 15 - currentHour;
      const minutesLeft = 59 - currentMinute;
      const secondsLeft = 59 - currentSecond;
      heroTitle = 'Ikke lenge igjen nå 🫣';
      return messageOutput(currentDay, hoursLeft, minutesLeft, secondsLeft);
    } else {
      const weekend = true;
      heroTitle = 'Det er helg! 🍻';
      return 'Ta deg en velfortjent øl';
    }
  } else if (currentDay === 6) { // Lørdag
    const weekend = true;
    heroTitle = 'Hva gjør du her?';
    return 'Det er lørdag, ta deg en øl 🍻';
  } else if (currentDay === 0) { // Søndag
    const weekend = true;
    heroTitle = 'Gruer du deg?';
    return 'Det nærmer seg mandag 😭';
  }
  return 'Ugyldig dag';
}

app.use("/public", express.static(__dirname + "/../public")); //Makes dist public
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  const interval = setInterval(() => {
    const message = getCurrentMessage();
    let fridayMessage = '';

    if (message !== message.weekend) {
      const local = new Date().toLocaleString("en-US", {timeZone: "Europe/Oslo"})
      const currentDay = new Date(local).getDay();
      //const currentDay = 3;
      if (currentDay !== 5) { // Ikke fredag
        const fridayTimeToNext = calculateTimeToNext(5, 16); // Target Friday, 16:00

        if (fridayTimeToNext <= 0) {
          fridayMessage = '';
        } else {
          const days = Math.floor(fridayTimeToNext / (24 * 60 * 60 * 1000));
          const hours = Math.floor((fridayTimeToNext % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
          const minutes = Math.floor((fridayTimeToNext % (60 * 60 * 1000)) / (60 * 1000));
          const seconds = Math.floor((fridayTimeToNext % (60 * 1000)) / 1000);

          if (days === 1) {
            daysOutput = days + ` dag,`;
          } else if (days != 0) {
            daysOutput = days + ` dager,`;
          } else if (days === 0) {
            daysOutput = '';
          }

          if (hours === 1) {
            hoursOutput = hours + ` time,`;
          } else if (hours != 0) {
            hoursOutput = hours + ` timer,`;
          } else if (hours === 0) {
            hoursOutput = '';
          }
      
          if (minutes === 1) {
            minutesOutput = minutes + ` minutt,`;
          } else if (minutes != 0) {
            minutesOutput = minutes + ` minutter,`;
          } else if (minutes === 0) {
            minutesOutput = '';
          }
      
          if (seconds === 1) {
            secondsOutput = seconds + ` sekund`;
          } else if (seconds != 0) {
            secondsOutput = seconds + ` sekunder`;
          } else if (seconds === 0) {
            secondsOutput = '';
          } else {
            secondsOutput = `0 sekunder`;
          }

          fridayMessage = `Det er helg om ${daysOutput} ${hoursOutput} ${minutesOutput} ${secondsOutput}`;
        }
      }
    }

    socket.emit('update', message, fridayMessage, heroTitle);
  }, 1000);

  socket.on('disconnect', () => {
    clearInterval(interval);
  });
});

http.listen(port, () => {
  console.log(`Serveren kjører på http://localhost:${port}`);
});