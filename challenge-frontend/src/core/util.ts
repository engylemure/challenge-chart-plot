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

export function generateLabelFromDataSetInfo(
  group: string[],
  selection: string
): string {
  let osInfo = group[0] ? `${capitalize(group[0])} ` : ''
  let browserInfo = group[1] ? `${capitalize(group[1])} ` : ''
  return `${osInfo}${browserInfo}${selection
    .split('_')
    .reduce(
      (acc: string, value: string) =>
        acc ? `${acc} ${capitalize(value)}` : capitalize(value),
      ''
    )}`
}
