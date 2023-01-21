---
title: "Metaprogramming in Ruby: Part 2"
date: "2015-09-18"
categories:
- Blog
tags:
- Ruby
draft: "false"
---
**Table of Contents**

*   [Metaprogramming in Ruby: Part 1](/2015/08/metaprogramming-in-ruby-part-1/)
*   Metaprogramming in Ruby: Part 2

* * *

Welcome back to the Metaprogramming in Ruby series! If you haven’t done so yet, you may want to review [Metaprogramming Ruby: Part 1](/2015/08/metaprogramming-in-ruby-part-1/) in order to catch up to the content we’re going to talk about today. In that post, we discussed open classes, ruby’s object model & ancestors chain, defining methods dynamically, calling methods dynamically, and ghost methods. We’re going to finish up the metaprogramming talk in this post and show you some really powerful tools you can add to your ruby arsenal. Let’s begin.

Closures
--------

We’re going to start our discussion over closures by addressing **scope**. There are 3 spots in ruby where scope will shift (these are properly dubbed Scope Gates):

*   Class definitions
*   Module definitions
*   Methods

That makes something like this impossible:

{{< highlight ruby "linenos=table" >}}
my_var = "Success"
class MyClass
    # We want to print my_var here...
 
    def my_method
        # ..and here
    end
end
{{< / highlight >}}

But with metaprogramming, we can bend scope to our will and make this happen. Before we do that though, we need to discuss the two ways that you can define a class in ruby.

### Defining a Class – Statically

This is the way that we’re all familiar with:

{{< highlight ruby "linenos=table" >}}
# the normal way
class Book
    def title
        "All My Friends Are Dead"
    end
end
 
puts Book.new.title
 
# => All My Friends Are Dead
{{< / highlight >}}

There’s nothing new going on here. But did you know we can also define a class at runtime? If you’re unsure what I mean, check out this next example.

### Defining a Class – Dynamically

{{< highlight ruby "linenos=table" >}}
Book = Class.new do
    def foo
        "foo!"
    end
 
    #Both method declaration types work
 
    define_method('title') do
        "All My Friends Are Dead"
    end
end
 
puts Book.new.foo
puts Book.new.title
 
# => foo!
# => All My Friends Are Dead
{{< / highlight >}}

This is an alternative way to define a class in Ruby. If you remember the object model we discussed in [the previous post](/2015/08/metaprogramming-in-ruby-part-1/), you’ll recall that a class in ruby is also an object, and it has a class of **Class**. It was confusing to think about then, but here is an example of that. If we flip that phrase around, then that means if we instantiate an object out of class **Class**, then that object is also a class. That’s exactly what we’re doing here! We’re creating a class by calling _Class.new_ – all at runtime!

This allows us to pass scope gates and access **my_var** inside of the class declaration. From there, you have two ways to define methods. You can define methods the classical way such as how we defined the _foo_ method – but that’s still a scope gate. You can’t access my_var inside that method. If you want to access my_var inside of your method, you’ll need to dynamically define a method – just like how we defined the _title_ method.

You can see a full example of this as we return to our previous discussion on scope:

{{< highlight ruby "linenos=table" >}}
my_var = "Success"
 
MyClass = Class.new do
    "#{my_var} in the class definition"
 
    # Have to use dynamic method creation to access my_var
    define_method :my_method do
        "#{my_var} in the method"
    end
end
 
puts MyClass.new.my_method
 
# => Success in the method
{{< / highlight >}}

This seemingly “scopeless” process is called a **Flat Scope**. Whether you use this concept or not is up to you, but ruby provides you with the tools to let you make that choice.

### Blocks, Procs, and Lambdas

While they don’t necessarily fit under the bill of metaprogramming, blocks, procs, and lambdas are something that often aren’t fully understood by most developers, so I wanted to review them to clear up any inconsistencies in how they work. For starters, most things in Ruby are objects. Blocks are not. To pass them around, you use the **&** operator.

{{< highlight ruby "linenos=table" >}}
def my_method(greeting)
    "#{greeting}, #{yield}!"
end
 
my_proc = proc { "Bill" }
puts my_method("Hello", &my_proc)
 
# => Hello, Bill
{{< / highlight >}}

I defined a block in one scope, and passed it to a method using the & operator – where it was then yielded. Let’s move on now to the differences between **procs** and **lambdas**.

There are 2 main differences:

*   Lambdas throw an ArgumentError if the argument count doesn’t match when you call them. Procs do not.
*   Lambdas return in a local scope, whereas Procs return from the scope in which they were called.

That first difference isn’t too difficult to understand, but the second difference…not so much. Let’s do some examples to illustrate exactly how these two block types work.

Starting off with a lambda example:

{{< highlight ruby "linenos=table" >}}
def lambda_example
  l      = lambda {|x,y| return x * y }
  result = l.call(2, 4) * 10
  return result
end
 
puts lambda_example
 
# => 80
{{< / highlight >}}

This executes about how we would expect. In the lambda_example method, we define a lambda block which just accepts two arguments and multiplies them together. We then call that lambda with a 2 and 4, and multiply that result by 10. That gives us 80.

If we called the lambda with any more or less arguments than two, it would fail to execute and give us an **ArgumentError**.

Let’s move on to procs, where you can see a real difference:

{{< highlight ruby "linenos=table" >}}
def proc_example
    p      = proc {|x,y| return x*y }
  result = p.call(2, 4) * 10
  return result
end
 
puts proc_example
 
# => 8
{{< / highlight >}}

Hold on there – this code is exactly the same. All we did was swap out lambda for proc – and now the response is 8?

Yes, it’s 8, and the reason why is because of how procs return in the scope they were called in. Whenever you return inside of a proc, the return statement doesn’t execute in the scope inside of that block – it executes where you initially call the proc, which in this example is on line 3. Therefore, whenever we call the proc and return the value 8, the proc forces the entire method to return with that value instead of continuing on with the rest of the code. In fact, line 4 never even gets called because the method has already returned at that point because of the proc.

Other than the fact that you can call the proc with as many arguments as you want and you won’t get an ArgumentError, this is the major _sneaky_ difference between procs and lambdas.

To summarize closures, scope usually works as expected, but once you know how to manipulate it – you can do powerful things. Just be sure you know what you’re doing. Now let’s move on to evals.

* * *

Evals
-----

In ruby, there are 3 main types of evals:

1.  Instance Eval
2.  Class Eval
3.  Eval

### Instance Eval

[instance_eval](http://ruby-doc.org/core-1.9.3/BasicObject.html#method-i-instance_eval) is a method we can use to bust open and possibly manipulate an object’s internals. Here’s an example.

{{< highlight ruby "linenos=table" >}}
class Book
  def initialize
    @v = 1  # => Private variable
  end
end
 
obj = Book.new
 
x = 2
obj.instance_eval { @v = x }
puts obj.instance_eval {@v}
 
# => 2
{{< / highlight >}}

In our **obj** object, v is a private instance variable. We can’t call **obj.v** or else we’ll get an error – but we can use instance_eval to not only access and modify private instance variables, but also to set it to a variable that is in scope outside of that block – because blocks aren’t scope gates. While this example is pretty simple, I hope you can see how powerful this can be. But again – be careful. While you can access just about any attribute on an object this way, there’s usually a reason why instance variables or methods may be private.

### Class Eval

Even with open classes and dynamic class creation, we couldn’t update a class within another closure (like a method). We also couldn’t get into a class based on a variable – we had to use the constant. The method [class_eval](http://ruby-doc.org/core-2.2.0/Module.html#method-i-class_eval) allows us to do all of these things.

{{< highlight ruby "linenos=table" >}}
def add_method_to(a_class)
 
    a_class.class_eval do
        def m; 'Hello!'; end
    end
end
 
add_method_to(String)
puts "foo".m
 
# => Hello!
{{< / highlight >}}

For starters, class_eval lets us break into an existing class at any point in time – like in a method declaration as you see here. Secondly, and most importantly, class_eval allows us to open up a class based on a variable instead of the constant for that class. In this example we pass in the constant **String** into the method and assign it a parameter variable. We then open up the String class based on the variable it’s set to. We couldn’t do that through open-class code such as **class a_string** because that would try to open up a class called _a_string_ and not the value held by the variable.

We also bypass scope gates when we use class_eval and thus use a flat scope, similar to dynamic class declaration like we discussed earlier.

### Eval

We can now move on to the final eval function – just plain [eval](http://ruby-doc.org/core-2.2.2/Kernel.html#method-i-eval). This function is drop-dead simple to understand, but it’s extremely powerful – and very dangerous. All eval does is accept a single argument – a string – and run it as ruby code at the same point in runtime as when the eval method is called. Here’s a very basic example where we just use eval to append a value to an array:

{{< highlight ruby "linenos=table" >}}
array   = [10, 20]
element = 30
 
eval("array << element")
puts array
 
# => [10, 20, 30]
{{< / highlight >}}

We never actually run the ruby code ourselves to append the element variable to array, we just tell eval to do it by passing it the ruby code as a string. We don’t gain any benefit here by using eval, but take a look at this deeper example to begin to see powerful it can be:

{{< highlight ruby "linenos=table" >}}
klass = "Book"
instance_var = "title"
 
eval <<-CODE # This is just a multi-line string
    class #{klass}
        attr_accessor :#{instance_var}
 
        def initialize(x)
            self.#{instance_var} = x
        end
    end
CODE
 
b = Book.new("Moby Dick")
puts b.title
 
# => Moby Dick
{{< / highlight >}}

If you’re unfamiliar with the syntax after the eval method call, that’s just a [multiline string](http://blog.jayfields.com/2006/12/ruby-multiline-strings-here-doc-or.html) in ruby. In this example, we have 2 local variables in scope when we call eval, and we are using those variables to open up a class, create an attr_accessor, and write a constructor. But we’re doing it all by embedding variables into our multiline string. This executes as valid ruby at runtime, but this would never, ever be valid ruby code that we could write without the use of eval. Starting to see the power?

Good. Now we can talk about how **dangerous** eval is. Let’s say you want to create a program that allows you to test all the Array methods in a playground-type scenario. All you have to do is call a method with a string argument, and that string argument represents the method that you want to call on an array – just to see what the return value would be. And let’s say you want to expose this program to the world because it’s been very helpful for you, so you put it up on a website.

Here’s the code:

{{< highlight ruby "linenos=table" >}}
klass = "Book"
instance_var = "title"
 
eval <<-CODE # This is just a multi-line string
    class #{klass}
        attr_accessor :#{instance_var}
 
        def initialize(x)
            self.#{instance_var} = x
        end
    end
CODE
 
b = Book.new("Moby Dick")
puts b.title
 
# => Moby Dick
{{< / highlight >}}

Nothing bad happened, in fact, it returned exactly what I wanted it to – the index of value **c**, which is 2. But watch what happens if we call explore_array with a different argument:

{{< highlight ruby "linenos=table" >}}
explore_array("object_id; Dir.glob('*')")
 
# => assets
# => build
# => app.rb
# => ...
{{< / highlight >}}

Woah, what is all that? Yup, by looking at the code, you guessed it. That’s a listing of all the files and subdirectories inside of the main directory that’s running this app. That’s bad – really bad. Using eval often times makes you susceptible to code injection, which is why you have to absolutely be sure you know what you’re doing when you use it.

There are plenty of posts out there about how to keep eval as safe as possible, but the moral of the metaprogramming story keeps coming back: with great power comes great responsibility.

* * *

Final Thoughts
--------------

We’ve reached the end of our journey over Metaprogramming in Ruby. As I mentioned in [the first post](/2015/08/metaprogramming-in-ruby-part-1/), we didn’t cover Singleton Methods or Eigenclasses, but we reviewed just about everything else to some degree.

Metaprogramming is an advanced topic in any language, and that certainly applies to ruby. As you’ve seen so far, metaprograming allows you to write some really powerful code – but that code can be dangerous too. Whenever you use metaprogramming you automatically increase the code complexity of your project – it’s much more difficult to read and understand what’s going on. You also may run into other problems as we saw with open classes and the eval method, and those problems are very difficult to debug.

In the words of Matz (the creator of ruby), “ruby treats you like a grown up.” You are given all the tools to write powerful code – it’s just up to you to choose if they’re right for you. Now go forth, fellow ruby developer, and live your destiny. Whether you use these techniques or not – at the very least you’re now more aware of how some of the neat internals of ruby work.
