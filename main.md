<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Game</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div id = "gate">
        <p id = "selecttitle">Character selection</p>
        <div class="character-selection">
            <img onclick="gameStart('char1')" style="cursor:pointer" src="image1.png">
            <img onclick="gameStart('char2')" style="cursor:pointer" src="image2.png">
            <img onclick="gameStart('char3')" style="cursor:pointer" src="image3.png">
        </div>
        <div class="mode">
            <a href="">Solo</a>
            <a href="">Co-op</a>
        </div>
    </div>


    <script src="engine.js"></script>
</body>
</html>
