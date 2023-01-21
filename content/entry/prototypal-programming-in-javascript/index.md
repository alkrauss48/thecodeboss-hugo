---
title: "Prototypal Programming in Javascript"
date: "2015-08-28"
categories:
- Blog
tags:
- Javascript
draft: "false"
---
Javascript is an [object-oriented](https://en.wikipedia.org/wiki/Object-oriented_programming) programming language, but not like not like the ones you’re probably used to. Most programming languages that are object-oriented (C++, Java, C#, Ruby, Python, etc.) fall into the category of [class-based](https://en.wikipedia.org/wiki/Class-based_programming) object-oriented languages in which you define a class – a blueprint for attributes and methods – and you instantiate objects out of that class. All objects that come from the same class can access the same class-level (or static) methods and attributes; separate objects do typically have different instance variables (since that’s primarily what differs one object from another), but they all follow the same schema for their property names which is determined in the class definition – similar to how multiple rows in a SQL table will have different values, but they all follow a similar schema defined by the table.

So What Does That Make Javascript?
----------------------------------

Javascript is not class-based. It is [prototype-based](https://en.wikipedia.org/wiki/Prototype-based_programming), which defines a whole new set of rules for creating objects, accessing shared resources, and determining how to handle “inherited” properties. Javascript is by far the most popular prototypal language – in fact, if you’ve even heard of more than a couple of [the other ones](https://en.wikipedia.org/wiki/Prototype-based_programming#Languages_supporting_prototype-based_programming), then you’re a winner in my book. In a prototypal object-oriented language, you take the concept of classes completely out of the picture – they just don’t exist at all. Instead, **you just have objects**, and every object can have its own schema. I’ll repeat that – in Javascript, every object can define its own schema, and it’s perfect valid. They way you build relationships between objects is by creating direct object-to-object hierarchies; this means that you can create an object out of another object, and that child object automatically gets access to all the variables and methods of its parent object. Inheritance in the classical sense doesn’t exist in Javascript – instead, if the object doesn’t have the property you’re asking for, then you would _delegate_ that call up to the parent object which is called a **prototype**; this is where prototypal programming gets its name.

Want to know a secret? Prototypal programming in Javascript is **easy**. People tend to make it significantly more complicated than it needs to be because many developers are unfamiliar with what it means to be prototypal, let alone the fact that Javascript itself is prototypal at its core. Let’s do some examples:

{{< highlight javascript "linenos=table" >}}
var a = {
  name:     "Foo",
  alertMe:  function(){ alert("Foo!"); }
};

var b = Object.create(a);

b.name;       // Foo
b.alertMe();  // alerts with 'Foo!'
{{< / highlight >}}

In this example, we create a simple object **a** that has an attribute and a method. Nothing new there – but look at that next line. We are using the [Object.create()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create) method to create a new object _out of object **a**,_ because we passed it in as an argument. This is how _behavior delegation_ works in Javascript; **b** now has access to all of its prototype’s properties and can call them at will. This link from child-to-parent objects is called the [prototype chain](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain). If a property is called but not found on the object in question, the look-up continues through the prototype chain until the property is found or the chain ends, in which case **undefined** is returned. In this example, **b** did not have the properties _name_ or _alertMe()_, so it delegated those calls to its prototype **a**. This is different than class-based inheritance because no properties are copied to the objects; if a property doesn’t exist, it gets delegated up the prototype chain.

At the root of the chain, all objects inherit from [Object.prototype](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/prototype). This is how objects in Javascript get their default methods such as hasOwnProperty(), valueOf(), and toString().

Back to our example. Can we add more attributes to b? You bet’cha:

{{< highlight javascript "linenos=table" >}}
b.bar = "bar";

b.bar;  // bar
a.bar;  // undefined
{{< / highlight >}}

You can see that **b** can access this new attribute, but **a** can’t because it’s the parent object. You can only delegate up the prototype chain from child to parent, and not the other way around. But, if we instead add an attribute on object **a** – the parent object – then **b** automatically can access it because **a** is its prototype. We don’t need to redeclare **b** to access this new property (as we may need to do in class-based inheritance) because the prototype chain only relies on links to prototypes instead of copying any behavior down the chain! Here’s an example:

{{< highlight javascript "linenos=table" >}}
a.bazbar = "bazbar";

a.bazbar;  // bazbar
b.bazbar;  // bazbar
{{< / highlight >}}

* * *

Before moving on to the next section, I need to make sure we’re on the same page about behavior delegation. In Javascript, what we typically refer to as “inheritance” works via the prototype chain on an **object-to-object** level, not a class-to-class level (because classes don’t exist). No copies are made when creating children objects; instead, when a property is called that’s not found on an object, it is instead _delegated_ to a parent object up the prototype chain – so feel free to swap out the phrase “inheritance” with “delegation” because that’s a much more accurate description of what’s happening.

Shadowing (or Polymorphism)
---------------------------

We touched on delegation a bit, but what about overriding methods – such as in [polymorphism](https://en.wikipedia.org/wiki/Polymorphism_(computer_science)). With Javascript being a prototypal language, true polymorphism doesn’t happen. Remember – there are no classes (let alone abstract classes) and thus no required schema, so there’s not a real notion of an _overriden_ method like in class-based languages. However, you can still simulate polymorphic behavior using shadowing – where an object will create a new property on itself even if a property in its prototype chain already exists:

{{< highlight javascript "linenos=table" >}}
b.alertMe();  // Foo!

b.alertMe = function(){
  alert("I'm in B!");
};

b.alertMe();  // I'm in B!

// To access the prototype's alertMe() function:

b.__proto__.alertMe(); // Foo!
// or...
Object.getPrototypeOf('b').alertMe(); // Foo!
{{< / highlight >}}

The **alertMe** property on **b** is now a shadowed property that differs from its prototype, but you can see at the bottom of the above example that it’s still very easy to access the prototype and call its own properties.

**Big Note**: Shadowing like this will only work if a property is flagged as **writable: true**. By default, when you create a property through assignment (like we have so far), it is always set to writable – so shadowing can happen. If it is not writable, then not only will your child object be unable to create the property upon itself, but it will also be unable to modify the property up in the prototype chain. This may be confusing, so feel free to read more about [property descriptors](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty).

Because of the potential for undesired behavior in shadowing, it’s best to try to avoid it at all if possible.

Creating Objects and Adding Properties – All At Once
----------------------------------------------------

Whenever you create a new child object from a prototype using the **Object.create()** method, you can also pass in a second parameter representing the properties you would like to append to this child object. Let me show you an example:

{{< highlight javascript "linenos=table" >}}
var y = {
  foo: "foo"
};

var x = Object.create(y, {
  baz: {
    value: "baz"
  }
});

x.foo;   // foo
x.baz;   // baz
{{< / highlight >}}

Looks kind of weird, right? That’s because appending properties to an object like this follows a specific format – in fact, it’s the exact same format that the [Object.defineProperties()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperties) method uses. Instead of setting _value_ to a string, you can also set it to an integer, null, function, or any other data type in Javascript. In addition to setting the _value_ attribute, you can also set a getter method, a setter method, and whether the attribute is writable after initially assigned – all in this single argument. Overall, you get a lot of power by defining properties this way – at the expense of some additional syntax. You can think of this second argument to the **Object.create()** method to be _sort-of like_ a constructor (but not really – read on).

### My Thoughts on Constructors in Prototypal Languages

In true prototypal programming, constructors don’t exist because classes don’t exist. You would never add a constructor onto an object because the purpose of an object is to actually use that object as a data structure – not solely to create _other_ data structures (like a class). So, if your intention is to create multiple child objects that all have “instance variables” (relating back to class-based languages), then you would need to specify those extra child attributes each time you create a child object from a prototype. This might sound like extra work, but you can extract this second argument into a variable or use some other form of code reusability. You’re smart, so I believe in you. Or, you could let go of some of your class-based mentality and rebuild some of your data architecture to fit a prototypal mold – which is my preferred suggestion. At its core, Javascript is prototypal – don’t force it to act class-based.

How to NOT Do Prototypal Programming in Javascript
--------------------------------------------------

**Note**: A lot of you may disagree with me here because I’m going to share my thoughts over some development practices in Javascript that are pretty common. Practices which I don’t think are good. It’s not just me though; Kyle Simpson – author of [You Don’t Know JS](https://github.com/getify/You-Dont-Know-JS) – also agrees with me here.

In Javascript, functions are [first-class citizens](https://en.wikipedia.org/wiki/First-class_function) – meaning they can be assigned to variables, passed as arguments to other functions, and more. It’s perfectly fine to extend the capabilities of functions in this way (and a necessity for functional programming), but sometimes I feel that developers use functions for things they’re not meant to be used for in Javascript. Things like declaring data structures that no longer act like functions, and act more like classes.

### Poor Prototypal Javascript

If you google how to write prototypal Javascript, you’re bound to come across examples like this:

{{< highlight javascript "linenos=table" >}}
var Foo = function(){
  this.A = 1;
  this.B = 2;
};

Foo.prototype.C = 3;

var bar = new Foo();

bar.A;  // 1 (actual attribute of bar)
bar.B;  // 2 (actual attribute of bar)
bar.C;  // 3 (*inherited* attribute from Foo)
{{< / highlight >}}

Let me describe what’s going on here. We create a function called Foo which, when called, sets attributes A and B of the calling object. Then, we add another attribute called C to the function object; because functions are first class citizens, we can call attributes and methods on them, and you call the **.prototype** attribute on functions to get their modifiable prototype object. We then create an object out of the Foo function, which is then also called and sets preliminary attributes on the created object (this is what some developers call “the constructor call” in Javascript). After all that, we have a normal object called bar – which has as its prototype the function Foo.

Let’s think about this – does anything in this process make sense for Javascript? This is significantly closer to class-based programming than prototypal programming. In fact, if you swap out the word **function** with **class** when we declare our Foo variable, it makes so much more sense semantically (even though it wouldn’t execute). Then you can see that Foo is just a class, A and B are instance variables, C is a static variable, and bar is an instance of class Foo.

That’s not how Javascript is supposed to work, and this seems like a hack to force Javascript to work as if it’s class-based – which it’s not. To get more detailed, here’s my beef with why I don’t like this:

*   A function serves a unique purpose of executing a code block and potentially returning a value. A function should never be the parent of an object (like a real Javascript object), because that just doesn’t make sense.
*   The **new** keyword is ridiculously convoluted in Javascript. It helps create new objects, but it only works if it’s preceding a function call (dubbed a “constructor call,” solely because it is preceded by the **new** keyword); this doesn’t make sense either because in pure prototypal languages there is no “blueprint” to create an object out of. You’re just creating an object which has the parent of another object – no functions needed. In the words of Kyle Simpson:

    > _We end up with two objects, linked to each other. That’s it. We didn’t instantiate a class. We certainly didn’t do any copying of behavior from a “class” into a concrete object. We just caused two objects to be linked to each other. –_ You Don’t Know JS

*   Foo itself is the prototype to object bar. Why do I need to call **.prototype** on it to access its object values? It already IS the prototype! The answer? Because it’s a function and not a normal object like it should be – that’s why.

Lastly, writing code like this might not seem difficult to read – but that’s because you’re probably used to class-based languages and that’s what you’re interpreting it as. Javascript doesn’t have classes – it’s just objects linking to other objects, and this code doesn’t make that very clear. If you think about Foo being an object which has a child object of bar, this code probably doesn’t make as much sense, does it? Time for some refactoring.

### Good Prototypal Javascript

Let’s rebuild the code above to be proper prototypal code:

{{< highlight javascript "linenos=table" >}}
var Foo = {
  C: 3
};

var bar = Object.create(Foo);

bar.A = 1;
bar.B = 2;
{{< / highlight >}}

Look at how drastically simpler this is from our example up above. Even if we didn’t save many lines, it’s much easier to see what’s going on. Foo is an object now – a normal object – and bar is a child object out of Foo. Thus, Foo is the prototype of bar. We didn’t have to throw keywords like **new**, **function**, or **prototype** in there to convolute anything – and best of all, we’re working WITH the core structure of Javascript’s prototypal design – not against it.

Now, one detriment you’ve probably realized is that for every child object created out of Foo, we need to define attributes A and B. As stated earlier, constructors don’t make much sense in prototypal design because every object is free to have its own schema – but we can still build this logic in while staying perfectly prototypal. Let’s redeclare **bar** as an example:

{{< highlight javascript "linenos=table" >}}
var properties = {
  A: { value: 1 },
  B: { value: 2 }
};

var bar = Object.create(Foo, properties);
{{< / highlight >}}

Now if we want objects to share a common base schema, we just need to pass in the **properties** variable as the second argument to the Object.create() method. This doesn’t bind any permanent schema to the Foo object or to any future objects created from Foo – it’s just a simple way to add common properties to objects of our choosing.

**Note**: When adding properties in this manner to an object, they are by default immutable, meaning they can’t be altered after assigned. You can easily change this behavior if you want – check out how to modify [property descriptors](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperties) for more info.

Conclusion
----------

Javascript is a super powerful language with a lot of great features, but there’s one thing it’s not, and that’s class-based. You can’t – or should I say _shouldn’t_ – write Javascript as if it were class-based because you’ll easily end up with code that’s unclear and doesn’t always work as expected. Javascript is a prototypal object-oriented language, and taking advantage of that design choice will allow you to write really powerful code.

With all the new cool-kid tools and frameworks coming out seemingly every day for Javascript, I wanted to look back at the core API that all libraries use – whether it’s WebGL, Angular, Ember, Backbone, Node, etc. – and help others to understand why Javascript is the way it is, and to help you use that knowledge to write powerful, semantically-correct code. Whether you agree or disagree with me on my points – I hope you found some of this information enlightening!

In an upcoming post, we’ll cover how you can write prototypal code when coming from a class-based language, and we’ll compare code examples between Java (class-based) and Javascript (prototypal) which accomplish the same thing.
