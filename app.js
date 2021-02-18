$(document).ready(function () {

    var currentBal = 0;

    var cash = {
        "20": 7,
        "10": 15,
        "5": 4
    }
    //Insert Card
    $('#insert_card').on("click", function () {
        $('.start').hide();
        $('#pin_num').show();
    });

    //Check Pin
    $('#submit_pin').on("click", function () {
        pinNumber = $('#pin').val();

        $.post("/PinCheck", { pin: pinNumber }, function (data) {

            if (data === "fail") {
                $('#invaild_pin').show();
            }
            else {
                $('#pin_num').hide();
                $('#userScreen').show();
                currentBal = data;
                $('#currentBal').text("£" + currentBal);
            };
        });
    });

    //Widrawal Check and Action
    $('#submit_amount').on("click", function () {
        withdraw = $('#amount').val();
        newBal = currentBal - withdraw;

        if (newBal < 0 && newBal >= -100) {
            $('#displayBalance').addClass("error");
        }
        if (newBal < -100) {
            $('#incorrect').hide();
            $('#insufficient').show();
        }
        else {
            if (withdraw % 5 != 0) {
                $('#insufficient').hide();
                $('#incorrect').show();
                return false;
            }
            else {
                currentBal = newBal;
                $('#userScreen').hide();
                $('#getCash').show();
                $('#displayBalance').text("£" + currentBal);
                NoteDispense(withdraw);
            };
        };
    });

    //Cash Dispence function
    function NoteDispense(amount) {
        var twenty = 0;
        var ten = 0;
        var five = 0;
        var twenty_remainder = 0;
        var ten_remainder = 0;
        var half_amount = 0;
        var noOfTwentys = 0;
        var noOfTens = 0;
        var noOfFives = 0;

        if ((amount % 10) == 5) {
            half_amount = (amount - 5) / 2;
            five = 1;
        }
        else {
            half_amount = amount / 2;
        }

        for (var i = 0; i < 2; i++) {
            twenty_remainder = half_amount % 20;
            twenty = Math.floor(half_amount / 20);


            if (cash["20"] >= twenty) {
                cash["20"] -= twenty;
                noOfTwentys += twenty;
            }
            else {
                twenty_remainder += (20 * (twenty - cash["20"]));
                twenty = cash["20"];
                cash["20"] -= twenty;
                noOfTwentys += twenty;
            }

            if (twenty_remainder > 0) {
                ten_remainder = twenty_remainder % 10;
                ten = Math.floor(twenty_remainder / 10);

                if (cash["10"] >= ten) {
                    cash["10"] -= ten;
                    noOfTens += ten;
                }
                else {
                    ten_remainder += (10 * (ten - cash["10"]));
                    ten = cash["10"];
                    cash["10"] -= ten;
                    noOfTens += ten;
                }

                if (ten_remainder > 0) {
                    five = Math.floor(ten_remainder / 5);
                    cash["5"] -= five;
                    noOfFives += five;
                };
            };
        };

        // Testing Values
        console.log(noOfTwentys);
        console.log(noOfTens);
        console.log(noOfFives);
        console.log("20 remainder: " + cash["20"]);
        console.log("10 remainder: " + cash["10"]);
        console.log("5 remainder: " + cash["5"]);
        $('#displayNotes').text("£20 Notes: " + noOfTwentys + " ,  £10 Notes: " + noOfTens + " ,  £5 Notes: " + noOfFives);
    };

    //Exit Screen
    $('#exit').on("click", function () {
        $('#userScreen').hide();
        setTimeout(function () { location.reload() }, 500);
        $('.start').fadeIn(500);
    });

    //Make another withdrawal
    $('#yes').on("click", function () {
        $('#getCash').hide();
        $('#userScreen').show();

        $('#currentBal').text("£" + currentBal);
        if (currentBal < 0 && currentBal >= -100) {
            $('#currentBal').addClass("error");
        }
        $('#amount').val('');
        $('#incorrect').hide();
    });

    //Don't make another withdrawal
    $('#no').on("click", function () {
        $('#getCash').hide();
        $('#takeCard').show();
        $('#takeCard').delay(3000).fadeOut(500);
        setTimeout(function () { location.reload() }, 4000);
        $('.start').delay(4000).fadeIn(500);
    });

});