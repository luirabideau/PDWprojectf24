/*-------------------------------------- UHM ITM354 Final Project --------------------------------------*/

/*---------------------------------- GENERAL FUNCTIONS USED EVERWHERE ----------------------------------*/
function faviconInfo(){//contains favicon and css information
    document.write(`
      <link rel="stylesheet" href="./css/home.css">
      <link rel="icon" href="./images/letterR.ico" type="image/x-icon">
      <link rel="shortcut icon" href="./images/letterR.png" type="image/png">
    `)
}

function navBar1() {
    let isloggedin = getCookie("loggedIn");
    if (isloggedin == 1) {
      document.write(`
      <header>
      <div class="logo">
          <a href="./index.html"><img src="./images/CALL_logo.png"></a>
      </div>
      <div class="branding" style="display: flex; align-items: center;">
          <div class="emsync-logo">
              <img src="./images/emsync_logo.png" alt="EMSync Logo" style="max-height: 150px;">
          </div>
          <div style="display: flex; flex-direction: column; margin-top: -12px;">
              <h1 style="margin: 0;">EMSync</h1>
              <p style="margin-top: 0;">CALL HR Database</p>
          </div>
      </div>
  </header>
  <nav>
          <ul>
              <li><a href="./info.html">Basic Search</a></li>
              <li><a href="./adhoc.html">Advanced Query</a></li>
              <li class="dropdown">
                  <a href="./reports.html" class="dropbtn">Reports</a>
                  <ul class="dropdown-content">
                      <li><a href="./report-demographic.html">Demographics</a></li>
                      <li><a href="./report-turnover.html">Turnover</a></li>
                      <li><a href="./report-salary.html">Salary</a></li>
                  </ul>
                  <li><a href="./add_record.html">Edit DB</a></li>

              </li>
          </ul>
          <div class="login-button">
              <a href="./logout" onclick="logout()">
                  <img src="./images/login.png" alt="Staff Icon" class="login-icon"> Log Out
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
      <div class="branding" style="display: flex; align-items: center;">
          <div class="emsync-logo">
              <img src="./images/emsync_logo.png" alt="EMSync Logo" style="max-height: 150px;">
          </div>
          <div style="display: flex; flex-direction: column; margin-top: -12px;">
              <h1 style="margin: 0;">EMSync</h1>
              <p style="margin-top: 0;">CALL HR Database</p>
          </div>
      </div>
  </header>
      `);
    }
}

function navBar2() {
    let isloggedin = getCookie("loggedIn");
    if (isloggedin == 1) {
        document.write(`
        <header>
            <div class="logo">
                <a href="./index.html"><img src="./images/CALL_logo.png"></a>
            </div>
            <div class="branding" style="display: flex; align-items: center;">
                <div class="emsync-logo">
                    <img src="./images/emsync_logo.png" alt="EMSync Logo" style="max-height: 150px;">
                </div>
                <div style="display: flex; flex-direction: column; margin-top: -12px;">
                    <h1 style="margin: 0;">EMSync</h1>
                    <p style="margin-top: 0;">CALL HR Database</p>
                </div>
            </div>
        </header>
        <nav>
            <ul>
                <li><a href="./about.html">About</a></li>
                <li><a href="./contact_us.html">Contact Us</a></li>
                <li><a href="./payroll.html">Payroll</a></li>
                <li><a href="./grievances.html">Grievances</a></li>
                <li><a href="./training.html">Training</a></li>
                <li class="dropdown">
                    <a href="#" class="dropbtn">Upload</a>
                    <ul class="dropdown-content">
                        <li><a href="./grievances-form.html">Grievances</a></li>
                        <li><a href="./timesheet.html">Timesheet</a></li>
                        <li><a href="./fileupload.html">File Upload</a></li>
                    </ul>
                </li>
            </ul>
            <div class="login-button">
                <a href="./logout" onclick="logout()">
                    <img src="./images/login.png" alt="Staff Icon" class="login-icon"> Log Out
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
            <div class="branding" style="display: flex; align-items: center;">
                <div class="emsync-logo">
                    <img src="./images/emsync_logo.png" alt="EMSync Logo" style="max-height: 150px;">
                </div>
                <div style="display: flex; flex-direction: column; margin-top: -12px;">
                    <h1 style="margin: 0;">EMSync</h1>
                    <p style="margin-top: 0;">CALL HR Database</p>
                </div>
            </div>
        </header>
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