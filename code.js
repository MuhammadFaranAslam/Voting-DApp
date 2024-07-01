let votingDuration = 0;
let startTime = 0;
let endTime = 0;
let yesVotes = 0;
let noVotes = 0;
let votingStarted = false;
let hasVoted = false;
let timerInterval = null;

// Initialize web3
const web3 = new Web3(window.ethereum);

document.getElementById("start-voting").addEventListener("click", startVoting);
document.getElementById("cast-vote").addEventListener("click", castVote);

async function startVoting() {
    votingDuration = parseInt(document.getElementById("duration").value);
    startTime = new Date().getTime();
    endTime = startTime + (votingDuration * 60 * 1000);
    document.getElementById("poll-container").style.display = "block";
    document.getElementById("start-voting").style.display = "none";
    votingStarted = true;
    updateTimer();
}

async function castVote() {
    if (!votingStarted) {
        alert("Voting has not started yet! Please wait until the voting period begins.");
        return;
    }
    if (new Date().getTime() > endTime) {
        alert("Voting period has ended! You can no longer cast your vote.");
        return;
    }
    if (hasVoted) {
        alert("You have already voted! You can only vote once.");
        return;
    }
    let selectedOption = document.querySelector("input[name='option']:checked");
    if (!selectedOption) {
        alert("Please select an option before casting your vote.");
        return;
    }

    try {
        const contractAddress = '0xF5D374951A9D65E077f09b4e3293a94b810aC215';
        const contractABI = [

            
            {
                "constant": true,        "inputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "name": "voterVotes",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "optionYes",
      "outputs": [
        {
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "votingActive",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "pollQuestion",
      "outputs": [
        {
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "noVotes",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "votingPeriodDuration",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "optionNo",
      "outputs": [
        {
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "yesVotes",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "voter",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "vote",
          "type": "bool"
        }
      ],
      "name": "VoteCast",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [],
      "name": "VotingPeriodEnded",
      "type": "event"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_duration",
          "type": "uint256"
        }
      ],
      "name": "setVotingPeriodDuration",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "getPoll",
      "outputs": [
        {
          "name": "",
          "type": "string"
        },
        {
          "name": "",
          "type": "string"
        },
        {
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_vote",
          "type": "bool"
        }
      ],
      "name": "castVote",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "hasVotingPeriodEnded",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "getResults",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        },
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [],
      "name": "endVotingPeriod",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    }];
        const contract = new web3.eth.Contract(contractABI, contractAddress);

        const option = selectedOption.value === 'yes' ? 0 : 1;

        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];

        const result = await contract.methods.castVote(option).send({
            from: account,
            gas: 500000,  // Adjust gas limit as needed
            gasPrice: '5000000000'  // Adjust gas price as needed (5 gwei in wei)
        });

        console.log('Transaction successful:', result);

        // Update vote count and status
        if (selectedOption.value === "yes") {
            yesVotes++;
        } else {
            noVotes++;
        }
        hasVoted = true;
        document.getElementById("vote-status").innerHTML = "Your vote has been cast successfully!";
    } catch (error) {
        console.error('Error casting vote:', error);
        alert('Error casting vote. Please check the console for details.');
    }
}

function updateTimer() {
    let timeRemaining = endTime - new Date().getTime();
    let minutes = Math.floor(timeRemaining / 60000);
    let seconds = Math.floor((timeRemaining % 60000) / 1000);
    document.getElementById("timer").innerHTML = `Time remaining: ${minutes} minutes ${seconds} seconds`;
    if (timeRemaining <= 0) {
        clearInterval(timerInterval);
        document.getElementById("poll-container").style.display = "none";
        document.getElementById("results-container").style.display = "block";
        displayResults();
        votingStarted = false;
    } else {
        timerInterval = setInterval(updateTimer, 1000);
    }
}

function displayResults() {
    document.getElementById("yes-votes").innerHTML = `Yes: ${yesVotes} votes`;
    document.getElementById("no-votes").innerHTML = `No: ${noVotes} votes`;
}
