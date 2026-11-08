const inputUserID = document.getElementById("nptID");
const buttonAnalize = document.getElementById("btnNLZ");
const optionMode = document.getElementById("optMD");

const modeToKey = {
    1: 4,
    2: 7
}

const GRADES = [
    { l: "x", v: 1},
    { l: "ss", v: 0.99},
    { l: "s", v: 0.98},
    { l: "a", v: 0.95},
    { l: "b", v: 0.9},
    { l: "c", v: 0.8},
    { l: "d", v: 0.7},
]

buttonAnalize.onclick = async () => {
    const mapData = await GetData(`https://api.quavergame.com/v2/mapset/search?mode=${optionMode.value}`);
    console.log(`Total Ranked ${modeToKey[optionMode.value]}K: ` + mapData.total)

    const userData = await GetData(`https://api.quavergame.com/v2/user/${inputUserID.value || 1}`)
    const modeData = userData.user[`stats_keys${modeToKey[optionMode.value]}`];

    const ranks = { total: 0, acc: 0 }

    for (let i = 0; i < GRADES.length; i++) {
        const grade = GRADES[i].l;
        const gradeScores = modeData[`count_grade_${grade}`];
        const elementBar = document.getElementById(`rank-${grade}`);

        ranks[grade] = gradeScores;
        ranks["total"] += gradeScores;
        ranks["acc"] += gradeScores * GRADES[i].v;
        elementBar.style.width = `${100 * gradeScores / mapData.total}%`;

        console.log(`${grade}-ranks: ${gradeScores}`);
    }
    document.getElementById(`rank-total`).style.width = `${100 * ranks.acc / mapData.total}%`;
    console.log("total: " + ranks.total)
    console.log("total %: " + 100 * ranks.total / mapData.total)
    console.log("acc: " + 100 * ranks.acc / mapData.total)

}

async function GetData(url) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    return result;
}