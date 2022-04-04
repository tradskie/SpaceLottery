var currentAddr = null;
var web3;
var spendLimitEther;
var usrBal;
var priceInUSD;
var lastNumEggs=-1
var lastNumMiners=-1
var lastSecondsUntilFull=100
var lastHatchTime=0
var eggstohatch1=0
var maxDeposit=0
var totalDeposits=0
var lastUpdate=new Date().getTime()
var contractBalance;
var ticketPrice=0;
var maxLotteryTickets=0;
var userRoundNumTix = 0;
var allowedDeposit = 0; 

var compoundPercent=0;
var compoundMaxDays=0;
var compoundStep=0;

var cutoffStep=0;
var withdrawCooldown=0;

var contract;


//const contractAddress = '0x840E74Dcc82E2557Be0a293d46402053c5160680'
//const tokenAddress = '0x133bDAcbDc746d2AB005633B99ee49C75066f0AD'  
const contractAddress = '0x300199486585EfBB2b0Edf050Ed4bC8537525eCc'
const tokenAddress = '0x3b56a620d8a4f68049964CfFe674Da9174193bC2'  

var tokenContract;

var started = false;

var canSell = true;

const tokenAbi = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"}]
const contractAbi = [{"inputs":[{"internalType":"address payable","name":"_owner","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"investor","type":"address"},{"indexed":false,"internalType":"uint256","name":"pot","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"round","type":"uint256"}],"name":"LotteryWinner","type":"event"},{"inputs":[{"internalType":"address","name":"value","type":"address"}],"name":"CHANGE_OWNERSHIP","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"LOTTERY_ACTIVATED","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"LOTTERY_PERCENT","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bool","name":"value","type":"bool"}],"name":"LOTTERY_STARTED","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"LOTTERY_START_TIME","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"LOTTERY_STEP","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"LOTTERY_TICKET_PRICE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MAX_BUY","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MAX_LOTTERY_PARTICIPANTS","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MAX_LOTTERY_TICKET","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MIN_BUY","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"PERCENTS_DIVIDER","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"value","type":"uint256"}],"name":"PRC_PROJECT","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"PROJECT","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"value","type":"uint256"}],"name":"SET_LOTTERY_PERCENT","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"value","type":"uint256"}],"name":"SET_LOTTERY_STEP","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"value","type":"uint256"}],"name":"SET_LOTTERY_TICKET_PRICE","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"value","type":"uint256"}],"name":"SET_MAX_BUY","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"value","type":"uint256"}],"name":"SET_MAX_LOTTERY_PARTICIPANTS","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"value","type":"uint256"}],"name":"SET_MAX_LOTTERY_TICKET","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"value","type":"uint256"}],"name":"SET_MIN_BUY","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"chooseWinner","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"currentPot","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"gamble","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"getBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"getLotteryHistory","outputs":[{"internalType":"uint256","name":"round","type":"uint256"},{"internalType":"address","name":"winnerAddress","type":"address"},{"internalType":"uint256","name":"pot","type":"uint256"},{"internalType":"uint256","name":"totalLotteryParticipants","type":"uint256"},{"internalType":"uint256","name":"totalLotteryTickets","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getLotteryInfo","outputs":[{"internalType":"uint256","name":"lotteryStartTime","type":"uint256"},{"internalType":"uint256","name":"lotteryStep","type":"uint256"},{"internalType":"uint256","name":"lotteryCurrentPot","type":"uint256"},{"internalType":"uint256","name":"lotteryParticipants","type":"uint256"},{"internalType":"uint256","name":"maxLotteryParticipants","type":"uint256"},{"internalType":"uint256","name":"totalLotteryTickets","type":"uint256"},{"internalType":"uint256","name":"lotteryTicketPrice","type":"uint256"},{"internalType":"uint256","name":"maxLotteryTicket","type":"uint256"},{"internalType":"uint256","name":"lotteryPercent","type":"uint256"},{"internalType":"uint256","name":"round","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getLotteryTimer","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getSiteInfo","outputs":[{"internalType":"uint256","name":"_totalEntries","type":"uint256"},{"internalType":"uint256","name":"_totalLotteryBonus","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getTimeStamp","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_adr","type":"address"}],"name":"getUserInfo","outputs":[{"internalType":"uint256","name":"_userTotalEntries","type":"uint256"},{"internalType":"uint256","name":"_totalLotteryBonus","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_userAddress","type":"address"}],"name":"getUserTickets","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"lotteryRound","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address payable","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"participantAdresses","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"participants","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"address","name":"","type":"address"}],"name":"ticketOwners","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"token_SPO","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalEntries","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalLotteryBonus","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalTickets","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"users","outputs":[{"internalType":"uint256","name":"userTotalEntries","type":"uint256"},{"internalType":"uint256","name":"totalLotteryBonus","type":"uint256"}],"stateMutability":"view","type":"function"}]


// ------ contract calls

function loadContracts() {
    console.log('Loading contracts...')
    web3 = window.web3
    contract = new web3.eth.Contract(contractAbi, contractAddress);
    tokenContract = new web3.eth.Contract(tokenAbi, tokenAddress);
    console.log('Done loading contracts.')
}

async function connect() {
    console.log('Connecting to wallet...')
    try {
        if (started) {
            $('#buy-eggs-btn').attr('disabled', false)
        }
        var accounts = await ethereum.request({ method: 'eth_requestAccounts' })
        if (accounts.length == 0) {
            console.log('Please connect to MetaMask.');
            $('#enableMetamask').html('Connect')
        } else if (accounts[0] !== currentAddr) {
            currentAddr = accounts[0];

            if (currentAddr !== null) {
                console.log('Wallet connected = '+ currentAddr)

                loadContracts()
                refreshData()

                let shortenedAccount = currentAddr.replace(currentAddr.substring(5, 38), "***")
                $('#enableMetamask').html(shortenedAccount)
            }
            $('#enableMetamask').attr('disabled', true)
        }
    } catch (err) {
        if (err.code === 4001) {
            // EIP-1193 userRejectedRequest error
            // If this happens, the user rejected the connection request.
            alert('Please connect to MetaMask.');
        } else {
            console.error(err);
        }
        $('#enableMetamask').attr('disabled', false)
    }
}

async function loadWeb3() {
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum)
        $('#enableMetamask').attr('disabled', false)
        if (window.ethereum.selectedAddress !== null) {
            await connect();
                setTimeout(function () {
                controlLoop()
                controlLoopFaster()
            }, 1000)
        }
    } else {
        $('#enableMetamask').attr('disabled', true)
    }
}

window.addEventListener('load', function () {
    setStartTimer();
    loadWeb3()
})

$('#enableMetamask').click(function () {
    connect()
});

function controlLoop() {
    refreshData()
    setTimeout(controlLoop, 25000)
}

function controlLoopFaster() {
    setTimeout(controlLoopFaster, 30)
}

function roundNum(num) {
    if (num == 0) { return 0};
    if (num < 1) {
        return parseFloat(num).toFixed(4)
    }
    return parseFloat(parseFloat(num).toFixed(2));
}

function refreshData() {
    console.log('Refreshing data...')
    contract.methods.MAX_LOTTERY_TICKET().call().then(maxTicket => {
        maxDeposit = maxTicket * ticketPrice;
        const contractMaxTicketPerUserPerLottery = web3.utils.fromWei(maxTicket, 'wei');
        $("#max-deposit").html(maxDeposit);
        allowedDeposit = maxDeposit - userRoundNumTix * ticketPrice;
        $("#allowed-deposit").html(allowedDeposit);
    }).catch((err) => {
        console.log(err);
    });

    tokenContract.methods.balanceOf(currentAddr).call().then(userBalance => {
        let amt = web3.utils.fromWei(userBalance, 'gwei');
        usrBal = userBalance;
        $('#user-balance').html(roundNum(amt))
    }).catch((err) => {
        console.log(err)
    });

    tokenContract.methods.allowance(currentAddr, contractAddress).call().then(result => {
        spendLimitEther = web3.utils.fromWei(result, 'gwei')
        $('#user-approved-spend').html(spendLimitEther);
        if (spendLimitEther > 0 && started && allowedDeposit > 0) {
            $("#buy-eggs-btn").attr('disabled', false);
            $("#busd-spend").attr('hidden', false);
            $("#busd-spend").attr('value', "10");
        }
    }).catch((err) => {
        console.log(err)
    });

    if (started) {

        contract.methods.getSiteInfo().call().then(result => {
            var contractTotalEntries = web3.utils.fromWei(result._totalEntries, 'gwei');
            $('#contract-lottery-entries').html(contractTotalEntries);

            var contractLotteryRewards = web3.utils.fromWei(result._totalLotteryBonus, 'gwei')
            $('#contract-lottery-rewards').html(contractLotteryRewards);

        }).catch((err) => {
            console.log(err);s
        });
    }

    contract.methods.getUserInfo(currentAddr).call().then(user => {
        var userTotalEntries = user._userTotalEntries;
        var userLotteryBonus = user._totalLotteryBonus;

    }).catch((err) => {
        console.log(err);
    });

    contract.methods.getLotteryInfo().call().then(result => {
        var round = result.round;

        if (round) {
            $("#lottery-round").text(`Round ${+round+1}`);
            contract.methods.ticketOwners(round, currentAddr).call().then(numTix => {
                userRoundNumTix = numTix;
                if (numTix && numTix > 0 && numTix < (maxDeposit / ticketPrice)) {
                    maxLotteryTickets = result.maxLotteryTicket;
                    var max = result.maxLotteryTicket;
                    var totalTickets = result.totalLotteryTickets;
                    $("#lotto-chance").html(`${(numTix/totalTickets*100).toFixed(2)}%`);
                    $("#your-tickets").html(numTix);
                    $("#max-user-tickets").html(max-numTix);
                }
            }).catch((err) => {
                console.log(err)
            });
            if (round >= 1) {
                contract.methods.getLotteryHistory(round-1).call().then(winner => {
                    var winnerAddress = winner.winnerAddress;
                    let shortenedAddr = winnerAddress.replace(winnerAddress.substring(6, 38), "***")
                    $("#previous-winner").html(shortenedAddr.toLowerCase());
                    var prevPot = web3.utils.fromWei(winner.pot, 'gwei');
                    $("#previous-pot-busd").html(prevPot);
                }).catch((err) => {
                    console.log(err)
                });
            }
        }
        var participants = result.lotteryParticipants;
        $("#round-participants").html(participants);

        var maxLotteryParticipants = result.maxLotteryParticipants;
        $("#max-participants").html(maxLotteryParticipants);

        var currentPot = result.lotteryCurrentPot;
        var amt = web3.utils.fromWei(currentPot, 'gwei')
        $("#lottery-pot").html(roundNum(amt));

        var start = result.lotteryStartTime;
        const dateStart = new Date(start*1000).toLocaleString();

        $("#lottery-start").html(dateStart);
        var step = result.lotteryStep;
        var numStart = +start;
        var numStep = +step;
        const dateEnd = new Date((numStart+numStep)*1000).toLocaleString();
        $("#lottery-end").html(dateEnd);

        var endTime = new Date(0);
        endTime.setUTCSeconds(dateEnd)
        setRoundTimer(dateEnd);

        var lotteryPrice = result.lotteryTicketPrice;
        if (lotteryPrice) {
            var _price = web3.utils.fromWei(lotteryPrice, 'gwei');
            ticketPrice = _price;
            $("#ticket-price").html(roundNum(_price))
            $('#busd-spend').attr('step', parseInt(maxLotteryTickets/5));
        }
    }).catch((err) => {
        console.log(err)
    });
    updateBuyPrice();
    console.log('Done refreshing data...')
}

function copyRef() {
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val($('#reflink').text()).select();
    document.execCommand("copy");
    $temp.remove();
    $("#copied").html("<i class='ri-checkbox-circle-line'> copied!</i>").fadeOut('10000ms')
}

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) { return pair[1]; }
    }
    return (false);
}

function setInitialDeposit(initialDeposit) {
    totalDeposits = initialDeposit;
    var initialBUSD = readableBUSD(initialDeposit, 2);
    $("#initial-deposit").html(initialBUSD);
}

function setTotalDeposit(totalDeposit) {
    var totalBUSD = readableBUSD(totalDeposit, 2);
    $("#total-deposit").html(totalBUSD);
}

function setTotalWithdrawn(totalWithdrawn) {
    var totalBUSD = readableBUSD(totalWithdrawn, 2);
    $("#total-withdrawn").html(totalBUSD);
}

var startTimeInterval;
function setStartTimer() {
    var endDate = new Date('December 15, 2021 7:00 EST').getTime();

    clearInterval(startTimeInterval)
    startTimeInterval = setInterval(function() {
        var currTime = new Date().getTime();

        // Find the distance between now and the count down date
        var distance = endDate - currTime;
        // Time calculations for days, hours, minutes and seconds
        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)  + days*24);
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (hours < 10) { hours = '0' + hours; }
        if (minutes < 10) { minutes = '0' + minutes; }
        if (seconds < 10) { seconds = '0' + seconds; }

        $("#start-timer").html(`${hours}h:${minutes}m:${seconds}s`);

        // If the count down is finished, write some text
        if (distance < 0) {
            clearInterval(startTimeInterval);
            $("#start-container").remove();
            started = true;
            refreshData()
        }
    }, 1000, 1);
}

var roundTimerInterval;
function setRoundTimer(endDate) {
    var endDate = new Date(endDate).getTime();

    clearInterval(roundTimerInterval)
    roundTimerInterval = setInterval(function() {
        var currTime = new Date().getTime();

        if(currTime < endDate){
            // Find the distance between now and the count down date
            var distance = endDate - currTime;
            // Time calculations for days, hours, minutes and seconds
            var days = Math.floor(distance / (1000 * 60 * 60 * 24));
            var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)  + days*24);
            var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
            if (hours < 10) { hours = '0' + hours; }
            if (minutes < 10) { minutes = '0' + minutes; }
            if (seconds < 10) { seconds = '0' + seconds; }
    
             $("#lottery-timer").html(`${hours}h:${minutes}m:${seconds}s`);
        } else {
            $("#choose-winner-btn").attr("hidden", false);
            $("#lottery-timer").html(`00h:00m:00s`);
        }


    }, 1000, 1);
}


function updateBuyPrice(busd) {
    if (busd == undefined || !busd) {
        busd = document.getElementById('busd-spend').value;
    }
}

function approve(_amount) {
    let amt;
    if (_amount != 0) {
        amt = +spendLimitEther + +_amount;
    }
    else {
        amt = 0
    }
    let _spend = web3.utils.toWei(amt.toString(), 'gwei')
    tokenContract.methods.approve(contractAddress, _spend).send({ from: currentAddr }).then(result => {
        if (result) {
            $('#busd-spend').attr('disabled', false);
            $('#buy-eggs-btn').attr('disabled', false);
            $('#buy-eggs-btn').attr('value', "10");
            refreshData();
        }

    }).catch((err)=> {
        console.log(err)
    });
}


function approveMiner() {
    let spendDoc = document.getElementById("approve-spend");
    let _amount = spendDoc.value;
    approve(_amount);
}

function chooseWinner() {
    $("#choose-winner-btn").attr("disabled", true)
    contract.methods.chooseWinner().send({ from: currentAddr }).then(() => {
        refreshData();
    })
}


function buyTickets(){
    var buyTicketsDoc = document.getElementById('busd-spend')
    var buyTickets = buyTicketsDoc.value;

    var buyAmount = web3.utils.toWei(buyTickets, 'gwei');
    var maxDepositAmount = web3.utils.toWei(`${maxDeposit}`, 'gwei');
	if(+buyAmount + +totalDeposits > +maxDepositAmount) {
		alert(`you cannot buy more than ${maxDeposit} tickets`);
        return
    }
    if(+buyAmount > usrBal) {
		alert("you do not have " + buyAmount + " SPACE ORE in your wallet");
        return
    }
    const buyAmountGwei = web3.utils.fromWei(`${buyAmount}`, 'gwei')
    if (+spendLimitEther < +buyAmountGwei) {
        var approveMore = buyAmountGwei - spendLimitEther;
        alert("you first need to approve " + approveMore + " more SPACE ORE before buying");
        return
    }

    if (buyTickets > 0) {
        contract.methods.gamble(buyAmount).send({ from: currentAddr }).then(result => {
            refreshData()
        }).catch((err) => {
            console.log(err)
        });
    }
}

function hatchEggs(){
    if (canSell) {
        canSell = false;
        console.log(currentAddr)
        contract.methods.hatchEggs(true).send({ from: currentAddr}).then(result => {
            refreshData()
        }).catch((err) => {
            console.log(err)
        });
        setTimeout(function(){
            canSell = true;
        },10000);
    } else {
        console.log('Cannot hatch yet...')
    }
}

function sellEggs(){
    if (canSell) {
        canSell = false;
        console.log('Selling');
        contract.methods.sellEggs().send({ from: currentAddr }).then(result => {
            refreshData()
        }).catch((err) => {
            console.log(err)
        });
        setTimeout(function(){
            canSell = true;
        },10000);
    } else {
        console.log('Cannot sell yet...')
    }
}

function getBalance(callback){
    contract.methods.getBalance().call().then(result => {
        callback(result);
    }).catch((err) => {
        console.log(err)
    });
}

function tokenPrice(callback) {
	const url = "https://api.coingecko.com/api/v3/simple/price?ids=binanceusd&vs_currencies=usd";
	httpGetAsync(url,callback);
}
function httpGetAsync(theUrl, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true);
    xmlHttp.send(null);
}

function readableBUSD(amount, decimals) {
  return (amount / 1e18).toFixed(decimals);
}
