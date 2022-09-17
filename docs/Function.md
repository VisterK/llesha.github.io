# Function

Similar to classes, functions can have assignments, which are visible only during function execution. Unlike classes,
functions execute in a strict top-down order. So each undefined variable will provide a compile error

## Constraints

**No same functions allowed**. Functions differ by name and number of arguments. ```fun function(a)```
and ```fun function(a,b)``` are different, but functions ```fun function(a)``` and ```fun function(b)``` are same.

## Embedded functions

Even though language is built to be as flexible as possible, there are functions that cannot be reassigned.

```kotlin
class Array {
    
}

class String {
    fun export() // for instances only, creates svg with all the instances that have export attribute
    fun log() // similar to console.log() in javascript
    fun rnd() // returns random double in 0..1 (1 is exclusive)

    fun int() // returns int from this string
    fun double() // returns double from this string
    fun str() // returns itself

}
```