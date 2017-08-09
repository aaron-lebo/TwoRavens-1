import json


def format_pretty(json_string, indent=4):
    """Load a string into JSON"""

    try:
        d = json.loads(json_string)
    except TypeError:
        return '(Invalid JSON) ' + json_string

    return json.dumps(d, indent=indent)



def format_pretty_for_html(json_string, indent=4):

    d = json.loads(json_string)

    return '<pre>%s</pre>' % json.dumps(d, indent=indent)
