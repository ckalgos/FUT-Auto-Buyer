# Fifa21-AutoBuyer 

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url] 
[![LinkedIn][linkedin-shield]][linkedin-url] 
<p align="center"> 
  <h3 align="center">Fifa21 AutoBuyer</h3>

  <p align="center">
    FIFA 21 Auto Buyer For Web App!
    <br />  
    <br /> 
    <a href="https://github.com/chithakumar13/Fifa21-AutoBuyer/issues">Report Bug</a>
    ·
    <a href="https://github.com/chithakumar13/Fifa21-AutoBuyer/issues">Request Feature</a>
  
  # Must Read :no_entry_sign:
   EA might (soft) ban from using transfer market in web app for using this tool. Continuously soft ban might lead to permanent ban as well. Also use of tools like this to gain advantage over other players is not ethically right.  
   
   Use this tool at your own risk, any developers contributing to this repo won’t held responsibility if your account gets banned.
  </p>
</p>

<!-- TABLE OF CONTENTS -->
## Table of Contents

* [Installation](#installation) 
* [Usage](#Usage)
* [Prerequisites](#prerequisites) 
* [Telegram Installation Guide](#Telegram) 
* [Roadmap](#Roadmap)  
* [Developer Guide](#DevGuide) 
* [Contributing](#contributing) 
* [Contact](#contact)

<!-- installation -->
## Installation  

* Download the latest release from - [Latest Release](https://github.com/chithakumar13/Fifa21-AutoBuyer/releases/).
* Add Tamper Monkey Extenstion to your Browser.
* Navigate to Create Script -> Then to Utilities.
* Under Utilities -> File (Import the two Scripts and Install it).
* Installation And Demo - [Video Guide](https://www.youtube.com/watch?v=M3Jn4FI1nUw).
 
Now in Ultimate Team Web App, new menu will be added as AutoBuyer. 

<!-- Usage -->
## Usage 

### AutoBuyer Settings

### Sell Price 
* If specified the autobuyer will list the bought item for the specified price.
* The tool will list all the cards in transfer target, make sure to move your cards to the club before running the tool to avoid losing the card. 

### Buy Price
* If specified the autobuyer will buy the card matching the search critieria for the price less than or equal to specified price.

### Bid Price
* If specified the autobuyer will bid on the card matching the search critieria for the price less than or equal to specified price.

### Wait Time
* The autobuyer will wait for the specified time before making the next search request.
* Default Value (`7 - 15`).

### Min clear count
* The autobuyer will clear all the sold items from transfer list when the count exceeds the specified value.
* Default Value (`10`).

### Max purchases per search request
* Indicates the count of cards the tool should buy or bid from the results of each request.
* Default Value (`3`).

### Stop After
* If specified the tool will automatically stop after running the tool foe the specified interval.
* Default Value (`1H`) (S for seconds, M for Minutes, H for hours).

### Expires In
* Will only Bid on Cards which expires with in this value.
* Default Value (`1H`). 

### Pause For
* The parameter has a dependency on Cycle Amount 
* The tool will pause for the specified interval, if the the number of search request in the given cycle matches the specified cycle amount.
* Default Value (`0S`) (S for seconds, M for Minutes, H for hours). 

### Cycle Amount 
* Indicates the amount of search request to be made before pausing the tool.
* Default Value (`10`). 

## Prerequisites

* To use this tool, the user should have access to the transfer market. 
* Hence play the required number of games to get access to the transfer market before trying this tool. 

<!-- Telegram -->
## Telegram Installation Guide

* Install Telegram
* Add @BotFather as a contact in telegram
* Send BotFather /newbot
* Type in your individual details like name etc.
* Follow the prompts, and finally copy it’s HTTP API Token
* Add your bot as a contact
* Send /start to your bot
* Visit this URL. https://api.telegram.org/botXXX:YYYYY/getUpdates (replace the XXX: YYYYY with your BOT HTTP API Token you just got from the Telegram B otFather)
* Here you can find your chat id (this process can take some minutes) --> e.g. "chat":{"id":133333338,"first_name":"John","last_name":"Player"
* Now you can add your bot token and chat id at the notification settings inside the bot GUI (near the Bottom)

<!-- ROADMAP -->
## Roadmap

See the [open issues](https://github.com/chithakumar13/Fifa21-AutoBuyer/issues) for a list of proposed features (and known issues).

## 💬 Community

If you are looking for help or any new feature request, join our discord group 

<img src="https://img.shields.io/discord/768336764447621122?color=green&label=Discord&logo=discord&logoColor=white">

<a href="https://discord.gg/cktHYmp">Join</a>

<!-- DevGuide -->
## Developer-Guide

Will be added soon.

<!-- CONTRIBUTING -->
## Contributing

Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/FeatureBranch`)
3. Commit your Changes (`git commit -m 'Add some FeatureBranch'`)
4. Push to the Branch (`git push origin feature/FeatureBranch`)
5. Open a Pull Request 

<!-- CONTACT -->
## Contact

Instagram - [@Instagram](https://www.instagram.com/i_m_ck13/) - chithakumar13@gmail.com

Project Link: [https://github.com/chithakumar13/Fifa21-AutoBuyer](https://github.com/chithakumar13/Fifa21-AutoBuyer)

<!-- MARKDOWN LINKS & IMAGES --> 

[contributors-shield]: https://img.shields.io/github/contributors/chithakumar13/Fifa21-AutoBuyer.svg?style=flat-square
[contributors-url]: https://github.com/chithakumar13/Fifa21-AutoBuyer/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/chithakumar13/Fifa21-AutoBuyer.svg?style=flat-square
[forks-url]: https://github.com/chithakumar13/Fifa21-AutoBuyer/network/members
[stars-shield]: https://img.shields.io/github/stars/chithakumar13/Fifa21-AutoBuyer.svg?style=flat-square
[stars-url]: https://github.com/chithakumar13/Fifa21-AutoBuyer/stargazers
[issues-shield]: https://img.shields.io/github/issues/chithakumar13/Fifa21-AutoBuyer.svg?style=flat-square
[issues-url]: https://github.com/chithakumar13/Fifa21-AutoBuyer/issues 
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=flat-square&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/chithakumar13 
