export interface ColorProps {
  green: number
  red: number
  blue: number
}

function _randomU16Value(): number {
  return Math.round(Math.random() * 255)
}

export function randomColor(): ColorProps {
  return {
    green: _randomU16Value(),
    red: _randomU16Value(),
    blue: _randomU16Value(),
  }
}
export function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export function getValueFromGroup(groupValue: any): string {
  if (groupValue.String) {
    return groupValue.String
  } else if (groupValue.Number) {
    return groupValue.Number
  } else if (groupValue.Bool) {
    return groupValue.Bool
  } else if (groupValue.Null) {
    return "Null"
  } else {
    return ""
  }
}

export function generateLabelFromDataSetInfo(
  group: any[],
  selection: string
): string {
  let groupInfo = group.map(([keyName, value]) => {
    return `${capitalize(keyName)}: ${capitalize(getValueFromGroup(value))}`
  }).join(", ")
  return `${groupInfo ? groupInfo + ', ': ''}${selection
    .split('_')
    .reduce(
      (acc: string, value: string) =>
        acc ? `${acc} ${capitalize(value)}` : capitalize(value),
      ''
    )}`
}
