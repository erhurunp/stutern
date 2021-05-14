class Member {
    constructor(userId, firstName, lastName, memberAge, memberLevel, favClub) {
        this.userId = userId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.memberAge = memberAge;
        this.memberLevel = memberLevel;
        this.favClub = favClub;
    }
}


class UI {
    addMemberToList(member) {
        const list = document.getElementById('member-list');
        const row = document.createElement('tr');       // Creates a table row
        // Inserts table columns
        row.innerHTML =`
            <td>${member.userId}</td>
            <td>${member.firstName} ${member.lastName}</td>
            <td>${member.memberAge}</td>
            <td>${member.memberLevel}</td>
            <td>${member.favClub}</td>
            <td><a href="#" class="delete">X</a></td>
        `;

        list.appendChild(row);
    }

    showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert ${className}`;
        div.appendChild(document.createTextNode(message));

        const container = document.querySelector('.top-section');
        const form = document.querySelector('#member-form');
        container.insertBefore(div, form);

        setTimeout(function(){
            document.querySelector('.alert').remove()
        }, 3000);
    }

    deleteMember(target) {
        if(target.className === 'delete') {
            target.parentElement.parentElement.remove();
        }
    }

    clearFields() {
        document.getElementById('firstName').value = '';
        document.getElementById('lastName').value = '';
        document.getElementById('memberAge').value = '';
        document.getElementById('memberLevel').value = '';
        document.getElementById('favClub').value = '';
    }
}

// Local storage
class Store {
    static getMembers() {
        let members;
        if(localStorage.getItem('members') === null) {
          members = [];
        } else {
          members = JSON.parse(localStorage.getItem('members'));
        }
    
        return members;
    }
    
    static displayMembers() {
        const members = Store.getMembers();
    
        members.forEach(function(member){
          const ui  = new UI;
    
          // Add member to UI
          ui.addMemberToList(member);
        });
    }
    
    static addMember(member) {
        const members = Store.getMembers();
    
        members.push(member);
    
        localStorage.setItem('members', JSON.stringify(members));
    }
    
    static removeMember(favClub) {
        const members = Store.getMembers();
    
        members.forEach(function(member, index){
         if(member.favClub === favClub) {
          members.splice(index, 1);
         }
        });
    
        localStorage.setItem('members', JSON.stringify(members));
    }
}

// DOM Load Event
document.addEventListener('DOMContentLoaded', Store.displayMembers);

// Event Listener for adding members
document.getElementById('member-form').addEventListener('submit', function(e){
    // Get form values
    const firstName = document.getElementById('firstName').value,
        lastName = document.getElementById('lastName').value,
        memberAge = document.getElementById('memberAge').value,
        memberLevel = document.getElementById('memberLevel').value,
        favClub = document.getElementById('favClub').value,
        userId = `${lastName.toLowerCase()}${firstName.toLowerCase()[0]}`

    const member = new Member(userId, firstName, lastName, memberAge, memberLevel, favClub);

    const ui = new UI();

    // Validation
    if(firstName === '' || lastName === '' || memberAge === '' || memberLevel === '' ||favClub === '') {
        // Error message
        ui.showAlert('Please fill in all fields', 'error');
    } else {
         // Add member to list
        ui.addMemberToList(member);

        // Add to local storage
        Store.addMember(member);

        // Success message
        ui.showAlert('Member added!', 'success')

        // Clear all fields
        ui.clearFields();
    }

    e.preventDefault();
});

// Event Listener for deleting entries
document.getElementById('member-list').addEventListener('click', function(e){
    const ui = new UI();

    ui.deleteMember(e.target);

    // Message
    ui.showAlert('Entry deleted!', 'success')
    
    e.preventDefault();
})