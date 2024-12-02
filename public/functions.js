/*---------- Created by Lui Rabideau, Xin Lin, Tassia Cocoran, Emma Sharp, and Jessica Bandol ----------*/
/* Incorporated into the design from W3schools: W3.CSS 4.15 December 2020 by Jan Egil and Borge Refsnes */
/*------------------------- Lui Rabideau's F2023 ITM352 Assignment 3 Template --------------------------*/
/*-------------------------------------- UHM ITM354 Final Project --------------------------------------*/



/*---------------------------------- GENERAL FUNCTIONS USED EVERWHERE ----------------------------------*/
function faviconInfo(){//contains favicon and css information
    document.write(`
      <link rel="stylesheet" href="./css/home.css">
      <link rel="icon" href="./images/letterR.ico" type="image/x-icon">
      <link rel="shortcut icon" href="./images/letterR.png" type="image/png">
    `)
}
//nav bar - upated by Tassia for styling and adding a logo 
//xin updated logo again and also adjusted order and name
function navBar1() {
  let isloggedin = getCookie("loggedIn");
  let nameCookie = getCookie("name");
  let total = getCookie("totalIC");
  if (isloggedin == 1) {
    document.write(`
   <header>
    <div class="logo">
        <a href="./index.html"><img src="./images/CALL_logo.png"></a>
    </div>
    <div class="branding">
        <h1>EMSync</h1>
        <p>CALL HR Database</p>
    </div>
    </header>
    
    <nav>
        <ul>
            <li><a href="#employee-management">About</a></li>
            <li><a href="#employee-management">Contact</a></li>
            <li><a href="#employee-management">Management</a></li>
            <li><a href="./logout" onclick="logout()">Log Out</a></li>
        </ul>
        <div class="login-button">
            <a href="./index.html">
                <img src="./images/login.png" alt="Staff Icon" class="login-icon"> Login
            </a>
        </div>
    </nav>
    `);
  } else {
    document.write(`
   <header>
    <div class="logo">
        <a href="./index.html"><img src="./images/CALL_logo.png"></a>
    </div>
    <div class="branding">
        <h1>EMSync</h1>
        <p>CALL HR Database</p>
    </div>
    </header>
    <nav>
        <ul>
            <li><a href="#employee-management">About</a></li>
            <li><a href="#employee-management">Contact</a></li>
            <li><a href="#employee-management">Management</a></li>
        </ul>
        <div class="login-button">
            <a href="./index.html">
                <img src="./images/login.png" alt="Staff Icon" class="login-icon"> Login
            </a>
        </div>
    </nav>
    `);
  }
}

function navBar2() {
  let isloggedin = getCookie("loggedIn");
  let nameCookie = getCookie("name");
  let total = getCookie("totalIC");
  if (isloggedin == 1) {
    document.write(`
   <header>
    <div class="logo">
        <a href="./index.html"><img src="./images/CALL_logo.png"></a>
    </div>
    <div class="branding">
        <h1>EMSync</h1>
        <p>CALL HR Database</p>
    </div>
    </header>
    
    <nav>
        <ul>
            <li><a href="#employee-management">About</a></li>
            <li><a href="#employee-management">Contact</a></li>
            <li><a href="#employee-management">Payroll</a></li>
            <li><a href="#employee-management">Grievances</a></li>
            <li><a href="#employee-management">Training</a></li>
            <li><a href="#employee-management">Applications</li>
            <li><a href="#employee-management">Forms</a></li>
            <li><a href="./logout" onclick="logout()">Log Out</a></li>
        </ul>
        <div class="login-button">
            <a href="./index.html">
                <img src="./images/login.png" alt="Staff Icon" class="login-icon"> Login
            </a>
        </div>
    </nav>
    `);
  } else {
    document.write(`
   <header>
    <div class="logo">
        <a href="./index.html"><img src="./images/CALL_logo.png"></a>
    </div>
    <div class="branding">
        <h1>EMSync</h1>
        <p>CALL HR Database</p>
    </div>
    </header>
    
    <nav>
        <ul>
            <li><a href="#employee-management">About</a></li>
            <li><a href="#employee-management">Contact</a></li>
            <li><a href="#employee-management">Payroll</a></li>
            <li><a href="#employee-management">Grievances</a></li>
            <li><a href="#employee-management">Training</a></li>
            <li><a href="#employee-management">Applications</li>
            <li><a href="#employee-management">Forms</a></li>
            <li><a href="./logout" onclick="logout()">Log Out</a></li>
        </ul>
        <div class="login-button">
            <a href="./index.html">
                <img src="./images/login.png" alt="Staff Icon" class="login-icon"> Login
            </a>
        </div>
    </nav>
    `);
  }
}


// from ChatGPT, modified by Lui Rabideau under prompt "function that gets current date"
function getCurrentDate() {// Function to get the current date in the format YYYY-MM-DD
    // Function from ChatGPT using the "make me a function that gets todays date using javascript" prompt
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function logout() {// deletes the logged in cookie and reloads the page
  // Deletes all cookies
  document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "name=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "loggedIn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "totalIC=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie =  "address=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  // Reload the current page
  location.reload();
}

// This function asks the server for a "service" and converts the response to text. 
function loadJSON(service, callback) {   
  let xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open('POST', service, false);
  xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
          // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
          callback(xobj.responseText);
        }
  };
  xobj.send(null);  
}

// from ChatGPT, modified by Lui Rabideau under prompt "function to reload the page every second for 5 seconds"
function reloadPageFor1Seconds() {
  let seconds = 0;
  const reloadInterval = setInterval(function () {
      if (seconds < 1) {
          location.reload();
          seconds++;
      } else {
          clearInterval(reloadInterval);
      }
  }, 1000); // 1000 milliseconds = 1 second
}


/*----------------------------------------- COOKIE FUNCTIONs -------------------------------------------*/

// from ChatGPT, modified by Lui Rabideau under prompt "make me a function that makes cookies that last for 30 minutes"
function setCookie(name, value, minutesToExpire) {// Function to set a cookie with a specified expiration time
  const expirationDate = new Date();
  expirationDate.setTime(expirationDate.getTime() + (minutesToExpire * 60 * 1000));
  const cookieString = `${name}=${value}; expires=${expirationDate.toUTCString()}; path=/`;
  document.cookie = cookieString;
}

// from ChatGPT, modified by Lui Rabideau under prompt "function to get the value of cookie"
function getCookie(name){// Function to get the value of a cookie by name
    let cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();
        if (cookie.indexOf(name + "=") === 0) {
            return decodeURIComponent(cookie.substring(name.length + 1));
        }
    }
    return null;
}

// from ChatGPT, modified by Lui Rabideau under prompt "function to check if cookie exists"
function checkCookie(cookieName) {// Function to check if a cookie exists
  var cookies = document.cookie.split(';');
  for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i].trim();
      if (cookie.indexOf(cookieName + "=") === 0) {
          return true; // Cookie found
      }
  }
  return false; // Cookie not found
}

/*------------------------------------------------------------------------------------------------------*/
