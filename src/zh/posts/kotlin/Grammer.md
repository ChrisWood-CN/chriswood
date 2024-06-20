---
title: Grammer
categories: Kotlin
tags:
  - Kotlin
  - Grammer
date: 2024-06-20 10:31:21
---

# Koltin 语法

[https://kotlinlang.org/](https://kotlinlang.org/)

> 基于版本 2.0.0

::: kotlin-playground hello-world

@file main.kt

```kotlin
fun main() {
    println("Hello, world!")
    // Hello, world!
}
```

:::

## 变量

::: kotlin-playground Variables

@file main.kt

```kotlin
fun main() {
  val popcorn = 5   // val只读变量
  val hotdog = 7
  var customers = 10  // var可变变量
  customers = 8
  println(customers)
  println("There are $hotdog hotdog")  // 字符串模板
  println("There are ${hotdog - 1} hotdog now")
}
```

:::

## 基本类型

```
整型                  Byte, Short, Int, Long
无符号整型            UByte, UShort, UInt, ULong
浮点型                Float, Double
布尔                  Boolean
字符                  Char
字符串                String

数组                  Array
```

```kotlin
// 类型放在变量后面有助于编译器类型推导，一般赋值之后有自动类型推导
val d: Int
d = 3
val e: String = "hello"

// 数组
val simpleArray = arrayOf(1, 2, 3)
// 1, 2, 3
val nullArray: Array<Int?> = arrayOfNulls(3)
// null, null, null
var exampleArray = emptyArray<String>()

// 嵌套数组
// Creates a three-dimensional array
val threeDArray = Array(3) { Array(3) { Array<Int>(3) { 0 } } }
println(threeDArray.contentDeepToString())
// [[[0, 0, 0], [0, 0, 0], [0, 0, 0]], [[0, 0, 0], [0, 0, 0], [0, 0, 0]], [[0, 0, 0], [0, 0, 0], [0, 0, 0]]]

// 访问数组元素
val simpleArray = arrayOf(1, 2, 3)
val twoDArray = Array(2) { Array<Int>(2) { 0 } }
simpleArray[0] = 10
twoDArray[0][0] = 2
println(simpleArray[0].toString()) // 10
println(twoDArray[0][0].toString()) // 2

//！！！数组使用！！！
//可变数量的参数传递给函数，将包含可变数量参数的数组传递给函数，使用扩展运算符 (*)
val lettersArray = arrayOf("c", "d")
printAllStrings("a", "b", *lettersArray)   // abcd

fun printAllStrings(vararg strings: String) {
  for (string in strings) {
    print(string)
  }
}
//比较两个数组是否具有相同顺序的相同元素
val compareArray1 = arrayOf(1, 2, 3)
val compareArray2 = arrayOf(1, 2, 3)
println(compareArray1.contentEquals(compareArray2))
// true
// 使用中缀符号
simpleArray[0] = 10
println(simpleArray contentEquals anotherArray)
// false
//变换数组 详见https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-array/

val sumArray = arrayOf(1, 2, 3)
println(sumArray.sum())

val shuffleArray = arrayOf(1, 2, 3)
shuffleArray.shuffle()
println(shuffleArray.joinToString())

val convertArray = arrayOf("a", "b", "c", "c")
println(convertArray.toSet())
println(convertArray.toList())

val pairArray = arrayOf("apple" to 120, "banana" to 150, "cherry" to 90, "apple" to 140)
println(pairArray.toMap())

//原始类型数组
BooleanArray、ByteArray、CharArray、DoubleArray、FloatArray、IntArray、LongArray、ShortArray
```

## 集合

```text
//每个集合类型都可以是可变的或只读的
Lists     可重复有序集合
Sets      无重复无序集合
Maps      键值对
```

::: kotlin-playground Collections

@file main.kt

```kotlin
fun main() {
  //Lists
  // Read only list
  val readOnlyShapes = listOf("triangle", "square", "circle")
  println(readOnlyShapes)
  println("The first item in the list is: ${readOnlyShapes[0]}")
  println("The last item in the list is: ${readOnlyShapes.last()}")
  println("readOnlyShapes has ${readOnlyShapes.count()} items")
  println("circle" in readOnlyShapes) // in 操作符
  // Mutable list with explicit type declaration
  val shapes: MutableList<String> = mutableListOf("triangle", "square", "circle")
  println(shapes)
  shapes.add("pentagon")
  shapes.remove("triangle")
  println(shapes)

  // Sets
  // Read-only set
  val readOnlyFruit = setOf("apple", "banana", "cherry", "cherry")
  println("This set has ${readOnlyFruit.count()} items")
  println("banana" in readOnlyFruit) // in 操作符
  // Mutable set with explicit type declaration
  val fruit: MutableSet<String> = mutableSetOf("apple", "banana", "cherry", "cherry")
  fruit.add("dragonfruit")
  fruit.remove("cherry")
  println(fruit)

  // Maps
  // Read-only map
  val readOnlyJuiceMenu = mapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
  println(readOnlyJuiceMenu)
  println("This map has ${readOnlyJuiceMenu.count()} key-value pairs")
  println(readOnlyJuiceMenu.containsKey("kiwi"))
  println("orange" in readOnlyJuiceMenu.keys)
  println(readOnlyJuiceMenu.values)
  // Mutable map with explicit type declaration
  val juiceMenu: MutableMap<String, Int> = mutableMapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
  println(juiceMenu)

  //ArrayDeque<T> 双端队列
  val deque = ArrayDeque(listOf(1, 2, 3))
  deque.addFirst(0)
  deque.addLast(4)
  println(deque) // [0, 1, 2, 3, 4]
  deque.removeFirst()
  deque.removeLast()
  println(deque) // [1, 2, 3]
}
```

:::

## 控制流

### 条件表达式

::: kotlin-playground Conditional expressions

@file main.kt

```kotlin
fun main(){
  // if
  val d: Int
  val check = true
  if (check) {
      d = 1
  } else {
      d = 2
  }
  println(d)

  //when as an expression
  val obj = "Hello"
  val result = when (obj) {
    // If obj equals "1", sets result to "one"
    "1" -> "One"
    // If obj equals "Hello", sets result to "Greeting"
    "Hello" -> "Greeting"
    // Sets result to "Unknown" if no previous condition is satisfied
    else -> "Unknown"
  }
  println(result)
  //when check a chain of Boolean expressions
  val temp = 18
  val description = when {
      // If temp < 0 is true, sets description to "very cold"
      temp < 0 -> "very cold"
      // If temp < 10 is true, sets description to "a bit cold"
      temp < 10 -> "a bit cold"
      // If temp < 20 is true, sets description to "warm"
      temp < 20 -> "warm"
      // Sets description to "hot" if no previous condition is satisfied
      else -> "hot"
  }
  println(description)
}
```

:::

### 区间

```kotlin
1..4    //等价于 1, 2, 3, 4
1..<4   //等价于 1, 2, 3
4 downTo 1  //等价于 4, 3, 2, 1
1..5 step 2   //等价于 1, 3, 5
'a'..'d'  //等价于 'a', 'b', 'c', 'd'
'z' downTo 's' step 2  //等价于'z', 'x', 'v', 't'
```

### 循环

::: kotlin-playground Loops

@file main.kt

```kotlin
fun main(){
  // for循环
  for (number in 1..5) {
      // number is the iterator and 1..5 is the range
      print(number)
  }
  val cakes = listOf("carrot", "cheese", "chocolate")
  for (cake in cakes) {
    println("Yummy, it's a $cake cake!")
  }

 //while 循环
 var cakesEaten = 0
  while (cakesEaten < 3) {
      println("Eat a cake")
      cakesEaten++
  }
  var cakesBaked = 0
  do {
    println("Bake a cake")
    cakesBaked++
  } while (cakesBaked < cakesEaten)
}
```

:::

## 方法

::: kotlin-playground functions

@file main.kt

```kotlin
// func 方法名(参数名：类型,参数名：类型)：返回值类型 { 方法体 return 返回值 }
fun sum(x: Int, y: Int): Int {
    return x + y
}
// 还可以写成单表达式函数
// fun sum(x: Int, y: Int) = x + y
// 无返回值的方法
fun printMessageWithPrefix(message: String, prefix: String) {
    println("[$prefix] $message")
}
// 带有默认参数的方法
fun printMessageWithPrefix(message: String, prefix: String = "Info") {
    println("[$prefix] $message")
}

fun main() {
    println(sum(1, 2))
    // 命名参数 可以按任何顺序传
    printMessageWithPrefix(prefix = "Log", message = "Hello")
    printMessageWithPrefix("Hello")
    //Lambda表达式
    println({ text: String -> text.uppercase() }("hello"))
    val numbers = listOf(1, -2, 3, -4, 5, -6)
    //方法分配给变量 并指定函数类型
    val upperCaseString: (String) -> String = { text: String -> text.uppercase() }
    println(upperCaseString("hello"))
    //方法作为参数传递
    val numbers = listOf(1, -2, 3, -4, 5, -6)
    val positives = numbers.filter { x -> x > 0 } //!!!如果 lambda 表达式是唯一的函数参数，则可以删除函数括号 ()
    val negatives = numbers.filter { x -> x < 0 }

    //!!!如果 lambda 表达式作为函数的最后一个参数传递，则该表达式可以写在函数括号 () 之外
    println(listOf(1, 2, 3).fold(0, { x, item -> x + item })) // 6
    println(listOf(1, 2, 3).fold(0) { x, item -> x + item })  // 6
}
```

:::

## 类

### 属性

```kotlin
//类名后面的括号 () 内
class Contact(val id: Int, var email: String)
//类主体{}内
class Contact(val id: Int, var email: String) {
  val category: String = ""
}
//类属性可以有默认值
class Contact(val id: Int, var email: String = "example@gmail.com") {
    val category: String = "work"
}
```

### 实例

使用[构造函数](#构造函数)创建实例,Kotlin 没有 new 关键字

```kotlin
class Contact(val id: Int, var email: String)

fun main() {
  val contact = Contact(1, "mary@gmail.com")
}
```

#### 构造函数

Kotlin 中的类具有一个主构造函数，还可能有一个或多个辅助构造函数，主构造函数在类头中声明，位于类名和可选类型参数之后。如果主构造函数没有任何注释或可见性修饰符，则可以省略构造函数关键字 constructor。

类头不能包含任何可运行的代码。如果要在对象创建期间运行某些代码，在类主体内使用初始化块，按顺序执行。

如果构造函数有注释或[可见性](#可见性)修饰符，则需要 constructor 关键字，并且修饰符位于其前面

```kotlin
class Person constructor(name: String) {
  //主构造函数参数可以在类主体声明的属性初始值设定中使用
  val customerKey = name.uppercase()
  init {
    //主构造函数参数可以在初始化块中使用
    println("First initializer block that prints $name")
  }
  init {
    println("Second initializer block that prints ${name.length}")
  }
}

//如果构造函数有注释或可见性修饰符，则需要 constructor 关键字，并且修饰符位于其前面
class Customer public @Inject constructor(name: String) { /*...*/ }
```

#### 可见性

类、对象、接口、构造函数和函数以及属性及其设置器都可以具有可见性修饰符.Kotlin 中有四种可见性修饰符：private、protected、internal 和 public。默认可见性是公开的

##### 包

函数、属性、类、对象和接口可以直接在包内的顶层声明

1. 不使用可见性修饰符，则默认使用 public，将在任何地方都可见
2. 将声明标记为 private，仅在包含该声明的文件内可见。
3. 将其标记为 internal，将在同一[模块](#模块)中的任何位置可见
4. protected 修饰符不可用于顶级声明

##### 类成员

1. private，仅在该类中可见
2. protected，该类中可见，在子类中可见
3. internal，模块内的任何看到声明类的客户端都可以看到其内部成员
4. public，任何看到声明类的客户端都会看到其公共成员

局部变量、函数和类不能具有可见性修饰符

##### 模块

模块是编译在一起的一组 Kotlin 文件，IntelliJ IDEA 模块、Maven 工程、Gradle 工程、一次调用 `<kotlinc>` Ant 任务编译的一组文件

### 类成员

1. 构造函数和初始化块
2. 方法
3. 属性
4. 嵌套类和内部类
5. 对象声明

### 继承

[https://kotlinlang.org/docs/inheritance.html](https://kotlinlang.org/docs/inheritance.html)

### 抽象类

类以及其中的某些或全部成员可以声明为 abstract。 抽象成员在本类中可以不用实现。继承不需要使用 open 关键字

可以用抽象成员覆盖非抽象开放成员

```kotlin
open class Polygon {
    open fun draw() {
        // some default polygon drawing method
    }
}

abstract class WildShape : Polygon() {
    // Classes that inherit WildShape need to provide their own
    // draw method instead of using the default on Polygon
    abstract override fun draw()
}
```

### 伴生对象

如果需要写一个静态工具类，在类内声明一个伴生对象，可以仅使用类名来访问伴生对象的成员

[https://kotlinlang.org/docs/object-declarations.html#companion-objects](https://kotlinlang.org/docs/object-declarations.html#companion-objects)

## 空安全

空安全是一组特征组合

- 显式声明程序中何时允许空值
- 检查空值
- 对可能包含空值的属性或函数使用安全调用
- 声明检测到空值时要采取的操作

### 可空类型

::: kotlin-playground Nullable types

@file main.kt

```kotlin
fun main() {
  // neverNull has String type
  var neverNull: String = "This can't be null"

  // Throws a compiler error
  // neverNull = null

  // nullable has nullable String type
  var nullable: String? = "You can keep a null here"

  // This is OK
  nullable = null

  // By default, null values aren't accepted
  var inferredNonNull = "The compiler assumes non-nullable"

  // Throws a compiler error
  // inferredNonNull = null

  // notNull doesn't accept null values
  fun strLength(notNull: String): Int {
      return notNull.length
  }

  println(strLength(neverNull)) // 18
}
```

:::

### 检查空值

```kotlin
fun describeString(maybeString: String?): String {
    if (maybeString != null && maybeString.length > 0) {
        return "String of length ${maybeString.length}"
    } else {
        return "Empty or null string"
    }
}
```

### 安全调用运算符.?

lengthString() 函数使用安全调用返回字符串的长度或 null

```kotlin
fun lengthString(maybeString: String?): Int? = maybeString?.length
```

### Elvis 运算符

访问 length 属性的安全调用返回 null 值。 Elvis 运算符返回 0 结果

```kotlin
val nullString: String? = null
println(nullString?.length ?: 0)
```
