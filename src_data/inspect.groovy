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

def lines = new File('bosses.csv').readLines()
def columns = getRepeatingColumnList(lines[0])
def values = lines.find{getLineList(it)[0] == '43113906'}
def object = [columns, getLineList(values)].transpose().collectEntries()