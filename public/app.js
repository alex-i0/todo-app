$(document).ready(()=> {
    $.getJSON('/api/todos')
    .then(addTodos)


    $('#todoInput').keypress(event=> {
        if(event.which == 13){
            createTodo();
        }
    });

    $('.list').on('click', 'span', (e)=> {
        e.stopPropagation();
        removeTodo($(e.target).parent());
    })

    $('.list').on('click', 'li', (e)=> {
        updateTodo($(e.target));
    })
});

function addOneTodo(element){
    let newTodo = $('<li class="task">' + element.name + '<span>X</span></li>')
    newTodo.data('id', element._id);
    newTodo.data('completed', element.completed);
    if(element.completed){
        newTodo.addClass("done");
    }
    $('.list').append(newTodo);
}


function addTodos(todos){
    todos.forEach(element => {
        addOneTodo(element);
    });
}



function createTodo(){
    let usrInput = $('#todoInput').val();

    $.post('/api/todos', {name: usrInput})
    .then(newTodo => {
        $('#todoInput').val('');
        addOneTodo(newTodo);
    })
    .catch(err => {
        console.log(err);
    });
}

function removeTodo(todo){
    let deleteUrl = '/api/todos/' + todo.data('id');

    $.ajax({
        method: 'DELETE',
        url: deleteUrl
    })
    .then(data => {
        todo.remove();
    })
    .catch(err=> {
        console.log(err);
    })
}

function updateTodo(todo){
    let updateUrl = '/api/todos/' + todo.data('id');
    let isDone = !todo.data('completed');
    let updateData = {completed: isDone};

    $.ajax({
        method: 'PUT',
        url: updateUrl,
        data: updateData
    })
    .then(updatedTodo => {
        todo.toggleClass("done");
        todo.data('completed', isDone);
    })
}