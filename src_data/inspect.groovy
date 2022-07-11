import groovy.json.*

def csvSplitterExpression = /,(?=(?:[^"]*"[^"]*")*[^"]*$)/
def csvOuterQuoteExpression = /^"|"$/
def getLineList = {
    String line -> line.split(csvSplitterExpression).collect{it.replaceAll(csvOuterQuoteExpression, '')}
}

def getRepeatingColumnList = { String line ->
    def i = 0
    line.split(csvSplitterExpression).collect{
        it.replaceAll(csvOuterQuoteExpression, '') + "#${i++}"
    }
}

def lines = new File('weapons.csv').readLines()
def columns = getLineList(lines[0])
def values = getLineList(lines.find{getLineList(it)[0] == '1000100'})
def object = [columns, values].transpose().collectEntries()
object.each{println it}
