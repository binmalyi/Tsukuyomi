export enum ANSI {
    Reset,
    Bold,
    Faint,
    Italic,
    Underline,
    Black = 30,
    Red,
    Green,
    Yellow,
    Blue,
    Magenta,
    Cyan,
    White,
    Bgblack = 40,
    Bgred,
    Bggreen,
    Bgyellow,
    Bgblue,
    Bgmagenta,
    Bgcyan,
    Bgwhite
};

export function toAnsi(text: string){
    return text.split(/(?=--)/g)
    .map(splitTxt => {
        const color = splitTxt.match(/(?<=--)\w+/g)?.toString()?.split(/(?=[A-Z])/g), text = splitTxt.match(/(?<=--\w+\s+).+/g)?.toString();
        return (!color || !text || color.some(key => !(key in ANSI))) ? splitTxt : `[0;${color.map((key, index, array) => ANSI[key as keyof typeof ANSI] + (index === array.length - 1 ? 'm' : ';')).join('')}${text.concat('[0m')}`;
    }).join('');
};