export const convertNum = (num) => {
    let tar = typeof num !== "number" ? parseInt(num) : num;
    return tar;
};

const handleNum = (num, plus = 0) => {
    if (num) {
        let total = parseInt(num) + plus;
        let rel = [];
        total = typeof total === "number" ? total.toString() : total;
        let tar = total.split("").reverse();
        tar.forEach((item, index) => {
            if (index % 3 === 0 && index !== 0) rel.push(",", item);
            else rel.push(item);
        });
        return rel.reverse().join("");
    }
};

export default handleNum;
