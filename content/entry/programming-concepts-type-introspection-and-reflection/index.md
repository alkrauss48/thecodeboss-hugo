---
title: "Programming Concepts: Type Introspection and Reflection"
date: "2016-02-12"
categories:
- blog
tags:
- Programming Concepts
draft: "false"
description: In this Programming Concepts series, we'll be learning about type introspection and reflection.
---
**Programming Concepts Series:**

*   [The Stack and the Heap](/2014/10/programming-concepts-the-stack-and-the-heap/)
*   [Compiled and Interpreted Languages](/2015/07/programming-concepts-compiled-and-interpreted-languages/)
*   [Concurrency](/2015/10/programming-concepts-concurrency/)
*   [Static vs. Dynamic Type Checking](/2015/11/programming-concepts-static-vs-dynamic-type-checking/)
*   Type Introspection and Reflection
*   [Core Functional Programming Concepts](/2016/12/core-functional-programming-concepts/)
*   [Garbage Collection](/2017/01/programming-concepts-garbage-collection/)

* * *

Often times during the runtime of a program, we need to ask questions about some of our data – things like what type it is or if it’s an instance of a certain class (in object-oriented programming). On top of that, sometimes we need to perform logic based on the object in question, such as call an instance method or a class method, or even modify some data internal to the object – and we may not have the necessary object variable or constant to do that. If this doesn’t make sense, hold on tight – that’s what we’re going to get into here today (with a lot of code examples!). Everything I just discussed here illustrates the purpose of two features found in just about every modern programming language we use these days: **type introspection** and **reflection**.

Type Introspection
------------------

[Type introspection](https://en.wikipedia.org/wiki/Type_introspection) is the ability of a program to examine the type or properties of an object at runtime. Just as we mentioned in the intro, the types of questions you might want to ask are what type is this object, or is it an instance of a certain class. Some languages even allow you to traverse the inheritance hierarchy to see if your object is derived from an inherited base class. Several languages have the type introspection capability, such as Ruby, Java, PHP, Python, C++, and more. Overall, type introspection is a very simple concept to understand – and you can really write powerful logic when you can query some of the metadata about your objects. Below are some examples of type introspection in the wild:

{{< highlight java "linenos=table" >}}
// Java

if(obj instanceof Person){
   Person p = (Person)obj;
   p.walk();
}
{{< / highlight >}}

{{< highlight php "linenos=table" >}}
//PHP

if ($obj instanceof Person) {
   // Do whatever you want
}
{{< / highlight >}}

In Python, the most common form of type introspection is using the **dir** method to list out the attributes of an object:

{{< highlight python "linenos=table" >}}
# Python

class foo(object):
  def __init__(self, val):
    self.x = val
  def bar(self):
    return self.x

...

dir(foo(5))
=> ['__class__', '__delattr__', '__dict__', '__doc__', '__getattribute__', '__hash__', '__init__', '__module__',
'__new__', '__reduce__', '__reduce_ex__', '__repr__', '__setattr__', '__str__', '__weakref__', 'bar', 'x']
{{< / highlight >}}

Lastly, in Ruby, type introspection is very useful – largely because of how ruby is built as a language. Just about everything is an object – even a class – and that leads to some really cool inheritance hierarchies and reflective capabilities (discussed more below). If you want to see some of the raw power of ruby, such as taking type introspection and reflection to the max, then check out my mini series on [Metaprogramming in Ruby](/2015/08/metaprogramming-in-ruby-part-1/).

For now, here’s a few simple examples of type introspection in ruby using IRB (the interactive ruby shell):

{{< highlight ruby "linenos=table" >}}
# Ruby

$ irb
irb(main):001:0> A=Class.new
=> A
irb(main):002:0> B=Class.new A
=> B
irb(main):003:0> a=A.new
=> #<A:0x2e44b78>
irb(main):004:0> b=B.new
=> #<B:0x2e431b0>
irb(main):005:0> a.instance_of? A
=> true
irb(main):006:0> b.instance_of? A
=> false
irb(main):007:0> b.kind_of? A
=> true
{{< / highlight >}}

You can also ask an object which class it is, and then even “compare” classes if you so desire (among many other things).

{{< highlight ruby "linenos=table" >}}
# Ruby

irb(main):008:0> A.instance_of? Class
=> true
irb(main):009:0> a.class
=> A
irb(main):010:0> a.class.class
=> Class
irb(main):011:0> A > B
=> true
irb(main):012:0> B <= A
=> true
{{< / highlight >}}

Type introspection is not reflection, however; reflection takes these core principles of type introspection and allows us to do some really cool, powerful, and sometimes scary things with our code.

Reflection
----------

If type introspection allows you to inspect an object’s attributes at runtime, then reflection is what allows you to manipulate those attributes at runtime. As a concrete definition, [reflection](https://en.wikipedia.org/wiki/Reflection_(computer_programming)) is the ability of a computer program to examine and modify the structure and behavior (specifically the values, meta-data, properties and functions) of a program at runtime. In layman’s terms, what this allows you to do is invoke a method on an object, instantiate a new object, or modify an attribute of an object – all without knowing the names of the interfaces, fields, methods at compile time. Because of the runtime-specific nature of reflection, it’s more difficult to implement reflection in a statically-typed language compared to a dynamically-typed language because type checking occurs at compile time in a statically-typed language instead of at runtime (you can read more about that [in my post](/2015/11/programming-concepts-static-vs-dynamic-type-checking/)). However it is by no means impossible, as Java, C#, and other modern statically-typed languages allow for both type introspection and reflection (but not C++, which allows only type introspection and not reflection).

Just as reflection is easier to implement in dynamically-typed languages as compared to statically-typed languages, it’s also easier to implement in interpreted language implementations compared to compiled language implementations. This is because as functions, objects, and other data structures are created and invoked at runtime, some sort of runtime system must exist to allocate memory properly. In an interpreted language implementation, this is simple because the interpreter by default usually provides the runtime system, but compiled language implementations must provide an additional compiler and interpreter that watches program execution throughout its runtime to allow reflection to occur (this can often be done through [program transformation](https://en.wikipedia.org/wiki/Program_transformation) as well).

I feel like we’ve stated a lot of technical definition about reflection, and it may or may not make much sense. Take a look at some more code examples below (both with reflection, and without), all of which involve instantiating an object of class **Foo** and invoking the **hello** instance method of that object.

{{< highlight javascript "linenos=table" >}}
// Javascript

// Without reflection
new Foo().hello()

// With reflection

// assuming that Foo resides in this
new this['Foo']()['hello']()

// or without assumption
new (eval('Foo'))()['hello']()

// or simply
eval('new Foo().hello()')
{{< / highlight >}}

{{< highlight java "linenos=table" >}}
// Java

// without reflection
Foo foo = new Foo();
foo.hello();

// with reflection
Object foo = Class.forName("complete.classpath.and.Foo").newInstance();
// Alternatively: Object foo = Foo.class.newInstance();
Method m = foo.getClass().getDeclaredMethod("hello", new Class<?>[0]);
m.invoke(foo);
{{< / highlight >}}

{{< highlight python "linenos=table" >}}
# Python

# without reflection
obj = Foo()
obj.hello()

# with reflection
class_name = "Foo"
method = "hello"
obj = globals()[class_name]()
getattr(obj, method)()

# with eval
eval("Foo().hello()")
{{< / highlight >}}

{{< highlight ruby "linenos=table" >}}
# Ruby

# without reflection
obj = Foo.new
obj.hello

# with reflection
class_name = "Foo"
method = :hello
obj = Kernel.const_get(class_name).new
obj.send method

# with eval
eval "Foo.new.hello"
{{< / highlight >}}

All of these examples show reflection being used, and it is by no means an extensive list of languages with reflective capabilities. Reflection is a very powerful concept which allows you to write some very powerful code, and it is considered a [metaprogramming](https://en.wikipedia.org/wiki/Metaprogramming) practice. Beware though, reflection can easily lead you down a rabbit hole of poor coding practices if you let it. While it has obvious benefits, code that uses reflection is much more difficult to read than non-reflective code, it may make documentation-searching and debugging more difficult, and it opens the doors for really bad things such as code-injection via **eval** statements.

### Eval Statements

Some reflective programming languages ship with the ability to write [eval statements](https://en.wikipedia.org/wiki/Eval) – statements that evaluate a value – usually a string – as though it were an expression and returns a result. Eval statements are often the most powerful concept of reflection – and even metaprogramming – that languages have, but they are also the most dangerous, as they pose massive security risks. While very powerful, you can just about always accomplish your goal without having to resort to an eval statement.

Take the following Python code for example, which accepts data from some third-party source such as the Internet (this is usually one of the only reasons why people consider using an eval statement):

{{< highlight python "linenos=table" >}}
session['authenticated'] = False
data = get_data()
foo = eval(data)
{{< / highlight >}}

If someone provides the following string to the **get_data()** method, then the program’s security has been compromised:

{{< highlight python "linenos=table" >}}
"session.update(authenticated=True)"
{{< / highlight >}}

In order to safely use an eval statement, you usually need to heavily limit the scope that the eval statement can execute in – which usually makes it more of a hassle than it’s worth to even use it at all then.

Conclusion
----------

Type introspection and reflection are very powerful concepts seen in modern programming languages, and understanding how to take advantage of them will allow you to write some really cool code. Just to review their difference one more time, **type introspection** is just _inspecting_ an object’s attributes, and **reflection** is the actual _manipulating_ or _invoking_ of an object’s attributes or functions. They go hand in hand, but make sure you are aware of how you use reflection, as your code can get pretty unreadable (and potentially insecure) if you abuse it. With great power comes great responsibility – that’s the motto for everything metaprogramming-related. Now go forth young padawan, and reflect!
