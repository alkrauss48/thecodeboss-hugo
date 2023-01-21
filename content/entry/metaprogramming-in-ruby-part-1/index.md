---
title: "Metaprogramming in Ruby: Part 1"
date: "2015-08-14"
categories:
- Blog
tags:
- Ruby
draft: "false"
---
**Table of Contents**

*   Metaprogramming in Ruby: Part 1
*   [Metaprogramming in Ruby: Part 2](/2015/09/metaprogramming-in-ruby-part-2/)

* * *

What is Metaprogramming?
------------------------

Metaprogramming is code that writes code for you. But isn’t that what code generators do, like the rails gem, or yeoman? Or even bytecode compilers?

Yes, but metaprogramming typically refers to something else in Ruby. Metaprogramming in ruby refers to code that writes code for you **dynamically. At runtime.** Ruby is a prime language for dynamic metaprogramming because it employs [type introspection](https://en.wikipedia.org/wiki/Type_introspection) and is intensely [reflective](https://en.wikipedia.org/wiki/Reflection_(computer_programming)) – to a higher degree than just about any other language out there. This allows you to do some really cool things like add in a ton of functionality with very few lines of code, but there’s a catch; you can jack up a lot of things too at the same time and/or end up with practically unreadable code if you’re not careful. The moral of the story is, in Uncle Ben’s words:

> “With great power comes great responsibility.”

When Uncle Ben said this, he wasn’t talking about any _real_ _life_ things. He was talking about Metaprogramming.

Let’s Get Started
-----------------

Let’s say you want to create a method that will accept a string and strip everything out except for alphanumeric characters:

{{< highlight ruby "linenos=table" >}}
def to_alphanumeric(s)
    s.gsub(/[^\w\s]/, '')
end

puts to_alphanumeric("A&^ar$o%n&* (is&*&))) t&*(*he B0&*S**^S)")
# => "Aaron is the B0SS"
{{< / highlight >}}

That gets the job done, but it’s not very object oriented. Let’s fix that.

Open Classes
------------

{{< highlight ruby "linenos=table" >}}
class String
    def to_alphanumeric
        gsub(/[^\w\s]/, '')
    end
end

puts "A&^ar$o%n&* (is&*&))) t&*(*he B0&*S**^S)".to_alphanumeric
# => "Aaron is the B0SS"
{{< / highlight >}}

In ruby, you can break open any existing class and add to it just like this – even if you weren’t the one who originally declared it (i.e. the String class here is a ruby default class). Cool stuff. Nuff said. However, there’s a problem with open classes. Check this code out.

{{< highlight ruby "linenos=table" >}}
class Array
    def replace(original, replacement)
        self.map {|e| e == original ? replacement : e }
    end
end

puts ['x', 'y', 'z'].replace('x', 'a')

# => a, y, z
{{< / highlight >}}

We wrote an Array#replace method that takes in 2 arguments, the first of which is the value you want to replace in the array, and the second of which you want to replace the first with.

This code works just fine. Why is this a problem? The Array#replace method already exists, and it swaps out the entire array with another array that you provide as an arg. We just overwrote that method, and that’s bad. We probably didn’t mean to do that.

This process of editing classes in ruby is called **Monkeypatching**. It’s not bad by any means, but you definitely need to be sure you know what you’re doing.

Ruby’s Object Model
-------------------

Before we get further, we need to talk about how Ruby’s object model works (Image from Metaprogramming Ruby – by Paolo Perrotta).

![ruby_object_model](https://personal-k8s-main-space.nyc3.cdn.digitaloceanspaces.com/thecodeboss.dev/entries/metaprogramming-in-ruby-part-1/ruby_object_model.png)

This may look like a confusing diagram, but it neatly lays out how objects, classes, and modules are related in ruby. There are 3 key things of note here:

*   Instantiated objects (obj1, obj2, obj3) have a class of **MyClass**
*   MyClass has a class of **Class** (This mean that classes are also objects in Ruby. That’s tough to wrap your head around, I know)
*   While MyClass has a class of Class, it inherits from **Object**

We’ll reference this again later in Part 2. For now, let’s move on to the Ancestors Chain.

Ancestors Chain
---------------

This diagram is a little bit easier to understand, and deals solely with inheritance and module inclusion (Image from Metaprogramming Ruby – by Paolo Perrotta).

![ancestor_chain](https://personal-k8s-main-space.nyc3.cdn.digitaloceanspaces.com/thecodeboss.dev/entries/metaprogramming-in-ruby-part-1/ancestor_chain.jpeg)

When you call a method, Ruby goes right into the class of the receiver and then up the ancestors chain, until it either finds the method or reaches the end of the chain. In this diagram, an object **b** is instantiated from class **Book**. Book has 2 modules included: **Printable** and **Document**. Book inherits from class **Object**, which is the class that nearly everything inherits from in Ruby. Object includes a module called **Kernel**. And finally, Object inherits from **BasicObject** – the absolute parent of every object in Ruby.

Now that we’ve got these 2 very important topics down a little – Ruby’s Object Model and the Ancestors Chain – we can get back to some code.

Methods
-------

In Ruby, you can dynamically create methods and dynamically call methods. And call methods that don’t even exist – without throwing an error.

### Methods Part 1: Dynamically Defining Methods

Why would you want to dynamically define methods? Maybe to reduce code duplication, or to add cool functionality. [ActiveRecord](http://guides.rubyonrails.org/active_record_basics.html) (the default [ORM](http://en.wikipedia.org/wiki/Object-relational_mapping) tool for Rails projects) uses it heavily. Check this example out.

{{< highlight ruby "linenos=table" >}}
class Book < ActiveRecord::Base
end

b = Book.new
b.title
{{< / highlight >}}

If you’re familiar with ActiveRecord, then this looks like nothing out of the ordinary. Even though we don’t define the title attribute in the Book class, we assume that _Book_ is an ORM wrapper around a Book database table, and that _title_ is an attribute in that table. Thus, we return the title column for that particular database row that **b** represents.

Normally, calling title on this class should error with a NoMethodError – but ActiveRecord dynamically adds methods just like we’re about to do. The ActiveRecord code base is a prime example of how you can use metaprogramming to the max.

Let’s try this out and create our own methods:

{{< highlight ruby "linenos=table" >}}
def foo
    puts "foo was called"
end

def baz
    puts "baz was called"
end

def bar
    puts "bar was called"
end

foo
baz
bar

# => foo was called
# => baz was called
# => bar was called
{{< / highlight >}}

See the duplication? Let’s fix that with metaprogramming.

{{< highlight ruby "linenos=table" >}}
%w(foo baz bar).each do |s|

    define_method(s) do
        puts "#{s} was called"
    end
end

foo
baz
bar

# => foo was called
# => baz was called
# => bar was called
{{< / highlight >}}

What we’re doing here is dynamically defining the methods **foo**, **baz**, and **bar**, and then we can call them. The [Module#define_method](http://ruby-doc.org/core-2.2.0/Module.html#method-i-define_method) method is something that I personally use a lot, and it’s so, so helpful. [Here’s an example](https://github.com/Staplegun-US/intervals_api/blob/master/lib/intervals_api/request_handler.rb#L21) of how I used it in a gem I wrote.

You can see how much code we saved here – especially if we were writing real methods. BUT – is it worth the added code complexity? That’s your call.

### Methods Part 2: Dynamically Calling Methods

Dynamically calling methods or attributes is a form of **reflection**, and is something many languages can do. Here’s an example of how to call a method by either the string or symbol name of that method in ruby:

{{< highlight ruby "linenos=table" >}}
%w(test1 test2 test3 test4 test5).each do |s|

    define_method(s) do
        puts "#{s} was called"
    end
end

# New Code

(1..5).each { |n| send("test#{n}") }

# => test1 was called
# => test2 was called
# => test3 was called
# => test4 was called
# => test5 was called
{{< / highlight >}}

The [Object#send](http://ruby-doc.org/core-2.2.2/Object.html#method-i-send) method is how we can dynamically call methods. Here I’m spinning through the numbers 1 through 5, and calling a method whose name is dependent on the current variable value. Clutch.

Because every object in Ruby inherits from Object, you can also call _send_ as a method on any object to access one of its other methods or attributes – like this:

{{< highlight ruby "linenos=table" >}}
class OKCRB
    def is_boss?
        puts "true"
    end
end

okcrb = OKCRB.new
okcrb.send("is_boss?")

# => true
{{< / highlight >}}

The power with _send_ comes when you want to call a method based on some in-scope situation – often times based off of a variable value. Object#send also allows you to call private functions – so be careful if you’re not meaning to do that. Use [Object#public_send](http://ruby-doc.org/core-2.2.2/Object.html#method-i-public_send) if you can – it does the same thing, but is restricted from accessing private methods and attributes.

### Methods Part 3: Ghost Methods

What happens if we try to execute this code?

{{< highlight ruby "linenos=table" >}}
class Book
end

b = Book.new
b.read
{{< / highlight >}}

We would get a **NoMethodError**, because Book doesn’t know how to handle the method _read_. But it doesn’t have to be that way. Let’s explore **method_missing**.

{{< highlight ruby "linenos=table" >}}
class Book
    def method_missing(method, *args, &block)
        puts "You called: #{method}(#{args.join(', ')})"
        puts "(You also passed it a block)" if block_given?
    end
end

b = Book.new

b.read
b.read('a', 'b') { "foo" }

# => You called: read()
# => You called read(a, b)
# => (You also passed it a block)
{{< / highlight >}}

[BasicObject#method_missing](http://ruby-doc.org/core-2.1.0/BasicObject.html#method-i-method_missing) provides you an option to build a handler that will automatically get called in the event of a NoMethodError – but before that error ever happens. You are then given as parameters the method name that you tried to call, its arguments, and its block. From there, you can do anything you want.

While this looks really cool, be hesitant to use it unless you have a valid reason, because:

*   It takes extra time to hit the method_missing handler because you traverse the Ancestor Chain
*   If you’re not careful, you’ll swallow actual errors uninentionally. User **super** to handle any unintended errors, which will then call the default method_missing handler.

* * *

That’s all we’re going to cover in this first part. We reviewed Open Classes, Ruby’s Object Model, The Ancestors Chain, Dynamic Method Declarations, Dynamic Method Calling, and Ghost Methods, but there’s even more in store for Part 2 where we’ll cover Scopes, Dynamically Defining Classes, Closures (Blocks, Procs, and Lambdas), Various Evals (instance_eval, class_eval, and eval), and Writing a Multi-Purpose Module.

We won’t be covering [Singleton Methods and Eigenclasses](http://www.integralist.co.uk/posts/eigenclass.html) however. Those concepts cover a good chunk of metaprogramming in Ruby, but they are in my opinion the most confusing concepts to master and I’ve never ran into a situation where using them would have made my code much better. So I chose to avoid them altogether, but if you’re interested in learning more there are tons of articles about them.

Thanks for sticking around until the end – and stay on the lookout for Metaprogramming in Ruby: Part 2!
