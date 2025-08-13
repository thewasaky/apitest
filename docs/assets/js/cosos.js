function syntaxHighlight(jsosn) {
    var json=jsosn;
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}

function formatJSON(json){
    let objeto;
    try {
        objeto = JSON.parse(json);
        return true;
        
    }
    catch (error) {
        return false;
        if(error instanceof SyntaxError) {
            let mensaje = error.message;
            console.log('ERROR EN LA SINTAXIS:', mensaje);
            return mensaje;
        } else {
            throw error; // si es otro error, que lo siga lanzando
        }
    }
}
function formatJSON2(json){
    let objeto;
    try {
        objeto = JSON.parse(json);
        return JSON.stringify(objeto, undefined, 4);
        
    }
    catch (error) {
       
    }
}