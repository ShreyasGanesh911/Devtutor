export const snippets={
    java:
`class HelloWorld {
public static void main(String[] args) {
    System.out.println("Hello World in Java!"); 
    // Hello World!
}
}
    `,
    javascript:`const greet = (a)=>{
console.log(a)
}
greet("Hello world in javascript")
    `,
    
    python:
    `print("Hello World in python!")`,
    

}
export const languages:{lang:string,version:string,snippet:string}[] = [ 
    {lang:'java',version:'15.0.2',snippet:snippets['java']},
    {lang:'javascript',version:'18.15.0',snippet:snippets['javascript']},
    {lang:'python',version:"3.10.0",snippet:snippets['python']},
]