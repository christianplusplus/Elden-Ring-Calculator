import groovy.json.*

def fileName = 'Boss_Data'
def lines = new File("source/${fileName}.csv").readLines()
def re_splitter = /,(?=(?:[^"]*"[^"]*")*[^"]*$)/
def re_unquote = /^"|"$/
def id = 0
def columns = lines[0].split(re_splitter).collect{it.replaceAll(re_unquote, '')}
def object = lines[1..-1].collectEntries{ line ->
    line = line.split(re_splitter).collect{it.replaceAll(re_unquote, '')}
    [id++, [columns, line].transpose().collectEntries()]    
}

new File("data/${fileName}.json").write(JsonOutput.toJson(object))