const inputUserID = document.getElementById("nptID");
const buttonAnalize = document.getElementById("btnNLZ");
const optionMode = document.getElementById("optMD");

//66471


const defaultMode = 1;
let mapData = undefined;
GetData(`https://api.quavergame.com/v2/mapset/search?mode=${optionMode.value}`).then(data => {
    mapData = data;
});

document.body.background = `https://cdn.quavergame.com/mapsets/${Math.floor(43685 * Math.random())}.jpg`
const modeToKey = {
    1: 4,
    2: 7
}

const GRADES = [
    { l: "x", v: 1},
    { l: "ss", v: 0.92},
    { l: "s", v: 0.83},
    { l: "a", v: 0.66},
    { l: "b", v: 0.33},
    { l: "c", v: 0.16},
    { l: "d", v: 0.08},
    //{ l: "f", v: 0}, // Not tracked, basically all unplayed maps
]

buttonAnalize.onclick = async () => {
    if (optionMode.value != defaultMode) {
        mapData = await GetData(`https://api.quavergame.com/v2/mapset/search?mode=${optionMode.value}`);
    }
    console.log(`Total Ranked ${modeToKey[optionMode.value]}K: ` + mapData.total)

    const userData = await GetData(`https://api.quavergame.com/v2/user/${inputUserID.value || 1}`)
    const modeData = userData.user[`stats_keys${modeToKey[optionMode.value]}`];

    document.getElementById("imgPFP").src = userData.user.avatar_url
    document.getElementById("txtUSRNM").innerText = userData.user.username

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
    document.getElementById(`rank-acc-text`).innerText = `${(100 * ranks.acc / mapData.total).toFixed(3)}%`
    document.getElementById(`rank-grade-text`).innerText = `${(100 * ranks.total / mapData.total).toFixed(3)}%`
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