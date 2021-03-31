const args=process.argv;               //getting command line arguments
const fs=require("fs");
let date=new Date();
fs.stat("todo.txt",(err,stat)=>{       //openinig two required files todo.txt and done.txt
    if(err==null){
        mainFunc();     
    }
    else if(err.code=='ENOENT'){
        fs.writeFile("todo.txt","",(err)=>{
            mainFunc();
        });
    }
})
function mainFunc(){                   //main Function
fs.stat("done.txt",(err,stat)=>{       //opening done.txt in main function
    if(err==null){}
    else if(err.code=='ENOENT'){
        fs.writeFile("done.txt","",(err)=>{
            if(err) console.log(err);
        })
    }
})
let usage=`Usage :-
$ ./todo add "todo item"  # Add a new todo
$ ./todo ls               # Show remaining todos
$ ./todo del NUMBER       # Delete a todo
$ ./todo done NUMBER      # Complete a todo
$ ./todo help             # Show usage
$ ./todo report           # Statistics`;
if(args[2]==undefined){
    console.log(usage);
}
switch(args[2]){                     //using switch case for user options
    case 'help':
        console.log(usage);
        break;
    case 'add':
        addTodo(args[3]);
        break;
    case 'ls':
        listTodo();
        break;
    case 'del':
        deleteTodo(args[3]);
        break;
    case 'done':
        markDoneTodo(args[3]);
        break;
    case 'report':
        reportTodo();
        break;
    default:console.log(usage);
}
function addTodo(todoTask){                    //function for add todo
    if (todoTask==undefined){
        console.log("Error: Missing todo string. Nothing added!");
        return;
    }
    fs.appendFile("todo.txt",todoTask,function(err){
        if (err) console.log(err);
        else{
            console.log("Added todo: "+`\"`+todoTask+`\"`)
            fs.appendFile("todo.txt","\r\n",function(err){
                if(err){
                    console.log(err);
                }
            })
        }
    })
}
 function listTodo(){                         //function for list todo
    var readline=require("readline");
    var stream=require("stream");
    var instream=fs.createReadStream("todo.txt");
    var outstream=new stream;
    var r1=readline.createInterface(instream,outstream);
    var arr=[];
    r1.on("line",function(line){
        arr.push(line);
    })
    r1.on("close",function(){
        if(arr[0]==undefined){                  //if nothing is in the todo.txt file
            console.log("There are no pending todos!")
        }
        else{
        for(i=arr.length-1;i>-1;i--){
            console.log("["+[i+1]+"]"+" "+arr[i]);
        }
    }
    })
}
function deleteTodo(x){                          //function for delete todo
    if(x==undefined){
        console.log("Error: Missing NUMBER for deleting todo.")
        return;
    }
    var readline=require("readline");
    var instream=fs.createReadStream("todo.txt");
    var r1=readline.createInterface(instream);
    var arr=[];
    r1.on("line",function(line){
        arr.push(line);                          //getting todo.txt content to array
    })
    r1.on("close",function(){
        flag=false;
        for(i=0;i<arr.length;i++){
            if(i==x-1){
                flag=true;
                for(j=i;j<arr.length;j++){       //deleting specific todo from array than writing that array to todo.txt
                    arr[j]=arr[j+1];
                }
                break;
            }
        }
        if(flag==true){
            arr.pop();
            fs.truncate('todo.txt', 0, function(){    //removing old content from file and appending new data
                for(i=0;i<arr.length;i++){
                    fs.appendFile("todo.txt",arr[i]+"\r\n",'utf-8',function(){})
                 }
            });  
           console.log("Deleted todo #"+x); 
        }
        else{
            console.log(`Error: todo #${x} does not exist. Nothing deleted.`);
        }
    })
}
function markDoneTodo(x){                         //function for marking a todo to done
    if(x==undefined){
        console.log("Error: Missing NUMBER for marking todo as done.");
        return;
    }
    var readline=require("readline");
    var instream=fs.createReadStream("todo.txt");
    var r1=readline.createInterface(instream);
    var arr=[];
    r1.on("line",(line)=>{            //getting content of todo.txt to array
        arr.push(line);
    })
    r1.on("close",()=>{
        flag=false;
        for(i=0;i<arr.length;i++){     //deleting an element from array and appending that array to done.txt
            if(i==x-1){
                flag=true;
                temp=arr[i];
                for(j=i;j<arr.length;j++){
                    arr[j]=arr[j+1];
                }
                fs.appendFile("done.txt","x"+" "+`${date.toISOString().slice(0, 10)}`+" "+temp+"\r\n",'utf-8',()=>{})
                break;
            }
        }
        if(flag==false){
            console.log(`Error: todo #${x} does not exist. Nothing deleted.`);
        }
        else{
            fs.truncate("todo.txt",0,(err)=>{});
            arr.pop();
            for(i=0;i<arr.length;i++){
                fs.appendFile("todo.txt",arr[i]+"\r\n",'utf-8',()=>{
                })
            }
            console.log(`Marked todo #${x} as done.`);
        }
    })
}

function reportTodo(){                          //current report of todo (how much todos are remaining and how much todos are done)
    const readline=require("readline");
    const readStream=fs.createReadStream("todo.txt");
    const readStream2=fs.createReadStream("done.txt");
    var pending=0;
    var completed=0;
    var r1=readline.createInterface(readStream);
    var r2=readline.createInterface(readStream2);
    r1.on("line",(line)=>{                      //reading a line from todo.txt if line exist incrementing the pending variable
        pending++;
    });
    r1.on("close",()=>{
    })
    r2.on("line",(line)=>{
        completed++;                            //reading a line from done.txt if line exist increment completed variable
    })
    r2.on("close",()=>{
        console.log(`${date.toISOString().slice(0, 10)} Pending : ${pending} Completed : ${completed}`);
    })

}
}
