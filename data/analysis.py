import json
from pprint import pprint

target = []

with open('summer-night-icists-export.json', encoding='utf-8') as f:
  data = json.load(f)
  games = data['games']
  for game in games:
    g = games[game]
    history = g['history']
    title = g['name']
    print(title, len(history))
    if g['type'] == 'PassFail':
      a = 0
      for log in history:
        l = history[log]
        if l['result'] == 'win':
          a += 1
      win_rate = a / len(history)
      target.append((title, len(history), win_rate))
    else:
      target.append((title, len(history)))
    print('-' * 15)

target.sort(key = lambda x : x[1], reverse = True)

pprint(target)