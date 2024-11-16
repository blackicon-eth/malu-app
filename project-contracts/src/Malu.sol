// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;


contract Malu {
    
    uint counter;

    event EventCreated(
        address indexed creator, 
        uint eventId,
        EventInfo info
    );

    event TicketAcquired(
        address indexed attendee,
        uint eventId
    );
    
    struct EventInfo{
        address creator;
        string description;
        string imageURI;
        string title;
        string location;
        uint startDate;
        uint endDate;
        uint ticketPrice;
        uint ticketSupply;
        bool paused;
    }

    mapping(uint eventId=>EventInfo) public s_events;
    mapping(address attendee=>mapping(uint eventId=>bool)) s_userTickets;
    mapping(address attendee=>mapping(uint eventId=>bool)) s_userAttended;
    
    function createEvent(
        uint ticketPrice,
        uint ticketSupply, 
        string memory description,
        string memory title, 
        string memory imageURI, 
        string memory location,
        uint startDate,
        uint endDate
    ) external {
        ++counter;
        
        EventInfo memory eventInfo = EventInfo({
            creator: msg.sender,
            description: description,
            imageURI: imageURI,
            title: title,    
            location: location, 
            ticketPrice: ticketPrice,
            ticketSupply: ticketSupply,
            startDate: startDate,
            endDate: endDate, 
            paused: false
        });
        s_events[counter] = eventInfo;
        emit EventCreated(msg.sender, counter, eventInfo);
    }
    

    function buyTicket(uint eventId) external {
        EventInfo memory eventInfo = s_events[eventId];
        require(block.timestamp < eventInfo.startDate , "Malu: Ticketing not available");
        require(!s_userTickets[msg.sender][eventId], "Malu: already have a ticket for this event");
        require(eventInfo.ticketSupply > 0, "Malu: out of supply");
        s_userTickets[msg.sender][eventId] = true;
        s_events[eventId].ticketSupply--;

        emit TicketAcquired(msg.sender, eventId);
    }  

    function attestPartecipation(uint eventId, address attendee) external {
        EventInfo memory eventInfo = s_events[eventId];
        require(msg.sender == eventInfo.creator, "Not creator");
        s_userAttended[attendee][eventId] = true;
    }

    function setEventPause(uint eventId, bool paused) external {
        EventInfo memory eventInfo = s_events[eventId];
        require(msg.sender == eventInfo.creator, "Malu: not creator");
        s_events[eventId].paused = paused;
    }

    
}
