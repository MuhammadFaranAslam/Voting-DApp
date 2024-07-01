
pragma solidity >=0.4.21 <0.6.0;
pragma experimental ABIEncoderV2;

contract Voting {
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    mapping(address => bool) public voters;
    mapping(uint => Candidate) public candidates;
    uint public candidatesCount;
    uint public votingEnd;

    constructor(uint _votingPeriod) public  {
        votingEnd = block.timestamp + _votingPeriod;
    }

    function addCandidate(string memory _name) public {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    }

    function vote(uint _candidateId) public {
        require(block.timestamp < votingEnd, "Voting period has ended");
        require(!voters[msg.sender], "You have already voted");
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate");

        voters[msg.sender] = true;
        candidates[_candidateId].voteCount++;
    }

    function getResult() public view returns (Candidate[] memory) {
        require(block.timestamp >= votingEnd, "Voting period is not yet ended");

        Candidate[] memory results = new Candidate[](candidatesCount);
        for (uint i = 1; i <= candidatesCount; i++) {
            results[i - 1] = candidates[i];
        }
        return results;
    }
}