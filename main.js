// @ts-check;
"use strict";
const problemId = [
  {name: "国語文法", id: "JJL"},
  {name: "国語古典", id: "JJC"},
  {name: "英語", id: "JE"},
  {name: "物理回路", id: "JCPC"},
  {name: "地理九州", id: "JSGJRY"},
  {name: "地理中四国", id: "JSGJRS"},
  {name: "歴史江戸", id: "JSHEE"},
  {name: "技術", id: "JT"}
];
const storageItem = JSON.parse(localStorage.getItem("parry") || '{"problemId":[]}');
const explain = document.getElementById("explain");
if (!storageItem.hasOwnProperty("problemId")) storageItem.problemId = [];
for (let i = 0; i < problemId.length; i++) {
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.id = "problemId-" + problemId[i].id;
  if (storageItem.problemId.includes(problemId[i].id)) checkbox.checked = true;
  checkbox.addEventListener("change", (event) => {
    if (event.target.checked) {
      storageItem.problemId.push(event.target.id.slice(10));
    } else {
      const index = storageItem.problemId.indexOf(event.target.id.slice(10));
      if (index !== -1) storageItem.problemId.splice(index, 1);
    }
    localStorage.setItem("parry", JSON.stringify(storageItem));
  });
  explain.appendChild(checkbox);
  const label = document.createElement("label");
  label.textContent = "　:" + problemId[i].name;
  label.setAttribute("for", "problemId-" + problemId[i].id);
  explain.appendChild(label);
  explain.appendChild(document.createElement("br"));
}

/** @type {HTMLCanvasElement} */
const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById("canvas"));
const wrapper = document.getElementById("canvasWrapper");
const ctx = /** @type {CanvasRenderingContext2D} */ (canvas.getContext("2d"));
const cssWidth = 1000;
const cssHeight = 525;
const scale = 2;
canvas.width = cssWidth * scale;
canvas.height = cssHeight * scale;
canvas.style.width = cssWidth + "px";
canvas.style.height = cssHeight + "px";
ctx.scale(scale, scale);
ctx.textBaseline = "middle";
const problemIdCenter = storageItem.problemId.length ? storageItem.problemId : "";
//変更可
const fontType = "Arial";//Arial or serif
const displayMode = "en";//en or jp
const fps = 30;//1~60
const idType = "id";//id or en or jp or other
const afterimage = false;//true or false
const displayLog = false;//true or false
//此処迄
ctx.font = "normal 17px " + fontType;
/**
 * @typedef {Record<string, never>} EmptyObject
 */
/**
 * @typedef {{name: "main"}} updateMainObject
 */
/**
 * @typedef {Object} updateMoveObject
 * @property {"move"} name
 * @property {{collections: any[], key: any[], movement: number, acelerations?: number}[]} changes
 * @property {{collections: any, key: any, op: string, value: any}[]} conditions
 */
/**
 * @typedef {Object} drawImgObject
 * @property {"img"} name
 * @property {Image} img
 * @property {number} x
 * @property {number} y
 * @property {number} width
 * @property {number} [height]
 */
/**
 * @typedef {Object} drawBorderObject
 * @property {"border"} name
 * @property {number} x
 * @property {number} y
 * @property {number} width
 * @property {number} height
 * @property {string} [borderColor]
 * @property {number} [borderWidth]
 */
/**
 * @typedef {Object} drawTextObject
 * @property {"text"} name
 * @property {number} x
 * @property {number} y
 * @property {string} text
 * @property {string} [font]
 * @property {string} [textAlign]
 * @property {string} [textBaseline]
 * @property {string} [fillColor]
 * @property {string} [borderColor]
 * @property {number} [borderWidth]
 * @property {number} [lineHeight]
 */
/**
 * @typedef {Object} drawRectObject
 * @property {"rect"} name
 * @property {number} x
 * @property {number} y
 * @property {number} width
 * @property {number} height
 * @property {string} [fillColor]
 * @property {string} [borderColor]
 * @property {number} [borderWidth]
 */
/**
 * @typedef {Object} drawPolyObject
 * @property {"poly"} name
 * @property {[number, number][]} locations
 * @property {string} [fillColor]
 * @property {string} [borderColor]
 * @property {number} [borderWidth]
 */
/**
 * @typedef {Object} drawArcObject
 * @property {"arc"} name
 * @property {number} x
 * @property {number} y
 * @property {number} r
 * @property {number} [start]
 * @property {number} [end]
 * @property {boolean} [reverse]
 * @property {string} [fillColor]
 * @property {string} [borderColor]
 * @property {number} [borderWidth]
 * @property {number} [globalAlpha]
 * @property {boolean} [connect]
 */
/**
 * @typedef {EmptyObject | updateMainObject | updateMoveObject} updateObject
 */
/**
 * @typedef {EmptyObject | drawImgObject | drawBorderObject | drawTextObject | drawRectObject | drawPolyObject} drawObject
 */
/**
 * @typedef {drawObject | drawObject[] | } draw
 */
/**
 * @typedef {Object} mainObject
 * @property {updateObject} update
 * @property {drawObject} draw
 */
/**
 * @param {HTMLImageElement} img
 * @param {string} src
 * @param {string} base
 */
function loadImg(img, src, base) {
  img.onerror = function () {
    console.log("failed to load: " + src);
    img.src = base;
    img.onerror = null;
  };
  img.src = src;
}
function setCanvasPosition() {
  const viewportHeight = window.innerHeight;
  const centerTop = (viewportHeight - cssHeight) / 2;
  wrapper.style.top = `${centerTop}px`;
  explain.style.top = `${centerTop}px`;
}
window.addEventListener("load", setCanvasPosition);
window.addEventListener("resize", setCanvasPosition);
/**/
const crabImg = new Image();
crabImg.className = "pixel";
loadImg(crabImg, "images/crab.png", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWCAYAAAA8AXHiAAADuElEQVR4nO3d0a7TOhCGUYp4QB6VNyx3KFscH2LFX5K2a12iqi3h1wzj1M7j+Xx+g9W+X/0FeE+CRUKwSAgWCcEiIVgkBIuEYJEQLBKCRUKwSAgWCcEiIVgkflz9BXgNj8fjz++rns/n41+vV7FICBYJrfBNzLaqPe+z9fz5c+qzVCwSgkXi1q1wVJa3jpT9V7fn+hx5n237m6VikRAsEo+77Sv8MnEMSvHj16///PNPaIur/nuwqv1t/y22n6tikRAsEslUuGqxbuTLYt2gLb6TXYuWO65DMf2NqFgkBItEvkB6aluMP2vrzM/aWtW2iva3pWKRECwSy1rhaGFzO62M2seqe17D77OoVV3Vale9z6r2N1oU3VKxSAgWiXwqnF3EO1Kui4XTq6a/rT3XZDQdX0XFIiFYJA61wtmSe7dyvcdoei3a4qprUix+7pkEt1QsEoJFYtlUuGqaK9xhsptVX5OaikVCsEhctq+wLvV77lceMT0RD1pwcS/vDlQsEoJF4t5b7LeLcjvaxOz9wTNbz5EWPHsdVjlyv1XFIiFYJG7dCmfdeaoaTamHtrSf+PedXVhWsUgIFolDp83MLu7deWp7FcOTdm7wU5ktFYuEYJFY1gq3jrRF7W+/4hquOtROxSIhWCSWnUF65qFerFWc6apikRAsEus2U8Snx4xcde/siKsm4l1HHCzabKJikRAsEvmTKc7cLHDnRde7tb96f6WKRUKwSJzaCrc+oS3e4TtsndkWVSwSgkXi1M0Ud5jOPtmZD7dSsUgIFon8eYW1u01eo+/w5cSbF7y/OUvFIiFYJE59MsUqq9rfnpY0es1sO9vz/nteXyjOaFWxSAgWiZc5beaqreV7/vyIqybHerFUxSIhWCRephV+ws9s3mmxVMUiIVgkXqYVFt6p9dyNikVCsEgIFgnBIiFYJASLhGCRECwSH71A+snsK+QlCRaJtzp4jf935KFLs1QsEoJFImmFs1vstcjOmUdwb6lYJASLRPKQpj2l1UOd1pptecPrb4s9dyZYJJpH9w7K6Z7Xa5F/m72vN9vOiraoYpEQLBLJ8wq3Zsvs7Pt8grq1Fc+aVLFICBaJc59McWDKqH/m8U5Gra04a3RExSIhWCRspnhzxcS3h4pFQrBIHGqFJrX342cz3Jpgkegf0qRdfiQVi4Rgkci32POZVCwSgkVCsEgIFgnBIiFYJASLhGCRECwSgkVCsEgIFgnBIiFYJASLhGCRECwSgkVCsEgIFgnBIiFYJASLxG/cOrp2LouKNAAAAABJRU5ErkJggg==");
const catImg = new Image();
loadImg(catImg, "images/cat.png", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWCAYAAAA8AXHiAAADdklEQVR4nO3d0XKbMBRF0brT//9l9y3jZEKLAhsEXuspk2YwVs/ci2SQH8/n8xfs7ffZJ8A9CRYJwSIhWCQEi4RgkRAsEoJFQrBICBYJwSIhWCQEi4RgkRAsEoJFQrBICBYJwSIhWCQEi4RgkRAsEn/OPoGvHo/Hx4OOz+fzcea5nOl1HJbMPD4qFgnBIvGY4RH7q5f9vSyNw+v/0ePx/TDMNj4qFgnBInFaK7xT2d/Llxnxmr//9vczjI+KRUKwSEyxQLpU9pfa4p0WUUfb36s1lw1nUbFICBaJQ1vhXcv+qDULwnsd/6xLBRWLhGCRmGJW+M72WqCe7VJBxSIhWCTyVrhmBvSPz7yGjj/zYunoTHBNO5vhlqclKhYJwSJx6KzwrjOgUUvjsOaSYPT9nnWpoGKRECwSSSvcayb4+jejM8Sr23LZMMOlgopFQrBI5LPCNSV9zR2kW45/pC2LvbO9ly1ULBKCReK022buVPZf1e/rKuOmYpEQLBKCRUKwSAgWid1mhXf6nI7tVCwSgkViVSscvQvxKot476a4XFnKg4pFQrBIDO9BunLr7J+f0MWfpxu15Tab0WOO+sFDHx//oGKRECwSm7bjHp1lFOX9im2xfi9LD6GMPpyy5XVVLBKCRWK3zwqPvHPyy9bch53DqLPa9wzjoGKRECwSl9mDdK+2sqZ17jWrmqF9L41bvRCtYpEQLBKLC6TRLRb/P6G4RNefo205hyPbogVSLkmwSCzOCpfuDNzyRUujiuOPzvKK9lG/1gz7sqpYJASLxHQLpDN8zvXqyPM5stXWM0QVi4Rgkai24/74ebbW9m62fNvF6IK2hynICRaJTa1whoW4vbxb+zYr5JIEi8Rut828Q/u4ijWPwO91W5TdZjiUYJHY7RF7rfBca9rfkVQsEoJFYlMr/HSghVmGFtmZrf29UrFICBaJ3Vrhp4PG+5S+m5XPWp7e/l6pWCQEi0TSChdfzMzxn67Y8paoWCQEi8ShrXDxJE7a2eYsd2p5S1QsEoJFYopWWJj5q4Sv3ubWULFICBaJ27ZCzqVikRAsEoJFQrBICBYJwSIhWCQEi4RgkRAsEoJFQrBICBYJwSIhWCQEi4RgkRAsEoJFQrBICBYJwSIhWCQEi4RgkRAsEoJFQrBICBYJwSIhWCQEi4RgkRAsEoJF4i8zlH/8XNgaRQAAAABJRU5ErkJggg==");
/*const schematicSymbolsImg = new Image();
loadImg(schematicSymbolsImg, "images/schematicSymbols.png", catImg);
schematicSymbolsImg.className = "pixel";*/
class Character {
  /**
   * @typedef {object} CommonMagic
   * @property {string[]} attribute
   * @property {number} useMp
   */
  /**
   * @typedef {CommonMagic & {name: "attack", magnification: number} | CommonMagic & {name: "heal", type: "amount", value: 50}} Magic
   */
  /**
   * @typedef {typeof Character & {magics: Record<string, Magic>}} CharCons
   */
  /** @type {Record<string, Magic>} */
  static magics = {
    fire: {name: "attack", attribute: ["fire"], useMp: 25, magnification: 1.5},
    heal: {name: "heal", attribute: ["light"], useMp: 12, type: "amount", value: 50}
  };
  static items = {
    catfood: {attribute: ["healHp"], healHp: 30}
  };
  /**
   * @param {Object} [object={}]
   * @param {string} [object.name]
   * @param {string} [object.type]
   * @param {number} [object.hp]
   * @param {number} [object.mp]
   * @param {number | {physical?: number, magical?: number}} [object.att]
   * @param {number | {physical?: number, magical?: number}} [object.def]
   * @param {number} [object.speed]
   * @param {any[]} [object.magics]
   * @param {any[]} [object.items]
   * @param {{
   *   fire?: number,
   *   water?: number,
   *   earth?: number,
   *   wind?: number,
   *   lightning?: number,
   *   ice?: number,
   *   poison?: number,
   *   light?: number,
   *   darkness?: number
   * }} [object.res]
   */
  constructor(object = {}) {
    this.ability = {
      name: object.name ?? "Unknown",
      type: object.type ?? "Unknown",
      hp: {
        max: object.hp ?? 100,
        now: object.hp ?? 100
      },
      mp: {
        max: object.mp ?? 100,
        now: object.mp ?? 100
      },
      att: {
        physical: {
          basic: typeof object.att === "object" ? object.att?.physical ?? 100 : object.att ?? 100,
          magnifications: []
        },
        magical: {
          basic: typeof object.att === "object" ? object.att?.magical ?? 100 : object.att ?? 100,
          magnifications: []
        }
      },
      def: {
        physical: {
          basic: typeof object.def === "object" ? object.def?.physical ?? 100 : object.def ?? 0,
          magnifications: []
        },
        magical: {
          basic: typeof object.def === "object" ? object.def?.magical ?? 100 : object.def ?? 0,
          magnifications: []
        }
      },
      res: {
        fire: object.res?.fire ?? 1,
        water: object.res?.water ?? 1,
        earth: object.res?.earth ?? 1,
        wind: object.res?.wind ?? 1,
        lightning: object.res?.lightning ?? 1,
        ice: object.res?.ice ?? 1,
        poison: object.res?.poison ?? 1,
        light: object.res?.light ?? 1,
        darkness: object.res?.darkness ?? 1
      },
      speed: object.speed ?? 100,
      magics: object.magics ?? [],
      items: object.items ?? []
    }
    characters.push(this);
    this.cons = /** @type {CharCons} */ (this.constructor);
  }
  /**
   * 
   * @param {Character} enemy 
   * @returns {{damage: number, damageRate: number, hpMax: number, hpNow: number}}
   */
  attack(enemy) {
    const attack = this.ability.att.physical.basic / 2 * this.ability.att.physical.magnifications.reduce((prod, magnification) => prod * magnification[1], 1);
    const defense = enemy.ability.def.physical.basic / 4 * enemy.ability.def.physical.magnifications.reduce((prod, magnification) => prod * magnification[1], 1);
    const damage = Math.min(Math.max(Math.floor((Math.max(attack - defense, 0) + 0.5 * attack * attack / (attack + defense)) / 3), 0), enemy.ability.hp.now);
    const damageRate = damage / enemy.ability.hp.max;
    enemy.ability.hp.now -= damage;
    return {damage, damageRate, hpMax: enemy.ability.hp.max, hpNow: enemy.ability.hp.now, logNumber: damage};
  }
  /**
   * 
   * @param {string} id 
   * @param {Character} enemy 
   * @returns 
   */
  magic(id, enemy) {
    console.log(id, enemy);
    if (this.cons.magics[id] && this.cons.magics[id].useMp <= this.ability.mp.now) {
      const name = this.cons.magics[id].name;
      if (name === "attack") {
        return this.magicAttack(id, enemy);
      } else if (name === "heal") {
        return this.magicHeal(id, enemy);
      }
    }
    console.log("Failed to use Magic\nid→", id);
    return false;
  }
  /**
   * @param {string} id 
   * @param {Character} enemy 
   * @returns 
   */
  magicAttack(id, enemy) {
    console.log(id);
    if (this.cons.magics[id].useMp > this.ability.mp.now) return false;
    const attack = this.ability.att.magical.basic / 2 * this.ability.att.magical.magnifications.reduce((prod, magnification) => prod * magnification[1], 1) * this.constructor.magics[id].magnification;
    const defense = enemy.ability.def.magical.basic / 4 * enemy.ability.def.magical.magnifications.reduce((prod, magnification) => prod * magnification[1], 1) * enemy.constructor.magics[id].attribute.reduce((prod, attribute) => prod * enemy.ability.res[attribute], 1);
    const damage = Math.min(Math.max(Math.floor((Math.max(attack - defense, 0) + 0.5 * attack * attack / (attack + defense)) / 3), 0), enemy.ability.hp.now);
    const damageRate = damage / enemy.ability.hp.max;
    const useMpRate = this.cons.magics[id].useMp / this.ability.mp.max;
    enemy.ability.hp.now -= damage;
    this.ability.mp.now -= this.cons.magics[id].useMp;
    return {damage, damageRate, hpMax: enemy.ability.hp.max, hpNow: enemy.ability.hp.now, mpMax: this.ability.mp.max, mpNow: this.ability.mp.now, useMpRate};
  }
  /**
   * @param {string} id 
   * @param {Character} target 
   * @returns 
   */
  magicHeal(id, target) {
    if (this.cons.magics[id].useMp > this.ability.mp.now) return false;
    let heal;
    if (this.cons.magics[id].type === "percent") {
      heal = Math.min(target.ability.hp.max * this.cons.magics[id].value, target.ability.hp.max - target.ability.hp.now);
    } else if (this.cons.magics[id].type === "amount") {
      heal = Math.min(this.cons.magics[id].value, target.ability.hp.max - target.ability.hp.now);
    }
    target.ability.hp.now = Math.min(target.ability.hp.now + heal, target.ability.hp.max);
    const useMpRate = this.cons.magics[id].useMp / this.ability.mp.max;
    this.ability.mp.now -= this.cons.magics[id].useMp;
    return {damage: heal, hpMax: target.ability.hp.max, hpNow: target.ability.hp.now, mpMax: this.ability.mp.max, mpNow: this.ability.mp.now, damageRate: 0, healRate: heal / target.ability.hp.max, useMpRate};
  }
  item(id, target) {
    if (this.cons.items[id]) {
      const attribute = this.cons.items[id].attribute;
      const heal = Math.min(this.cons.items[id].healHp, target.ability.hp.max - target.ability.hp.now);
      if (attribute.includes("healHp")) {
        target.ability.hp.now = Math.min(target.ability.hp.now + this.cons.items[id].healHp, target.ability.hp.max);
      }
      return {damage: heal, hpMax: target.ability.hp.max, hpNow: target.ability.hp.now, damageRate: 0, healRate: heal / target.ability.hp.max};
    }
  }
  endTurn() {
    [this.ability.att.physical.magnifications, this.ability.def.physical.magnifications].forEach((x) => {
      for (let i = 0; i < x.length; i++) {
        if (x[i][0] <= 0) {
          x.splice(i, 1);
          i--;
        } else {
          x[i][0]--;
        }
      }
    });
  }
}
/** @type {Object[]} */
const newUpdate = [];
/** @type {mainObject[]} */
const mainArray = [{update: {name: "main"}, draw: {}}];
/** @type {Character[]} */
const characters = [];
/** @type {{situation: "chooseCmd" | "choosedCmd" | "chooseMenu", cmdType?: "ATTACK" | "MAGIC" | "ITEM" | "DEFENSE", place?: number, menuType?: string}} */
const gameMode = {situation: "chooseCmd"};
const transparent = "rgba(0, 0, 0, 0)";
const allNames = {
  en: {fps: "fps", turn: "turn", correct: "correct", correctRate: "rate", hp: "HP", mp: "MP", attack: "ATTACK", magic: "MAGIC", item: "ITEM", defense: "DEFENSE", id: "id", enemy: "Enemy", you: "You", type: "type"},
  jp: {fps: "フレーム数/秒", turn: "ターン数", correct: "正解数", correctRate: "正答率", hp: "体力", mp: "魔力", attack: "攻撃", magic: "魔法", item: "持ち物", defense: "防御", id: "固有値", enemy: "敵", you: "汝", type: "種類"}
};
const displayNames = allNames[displayMode];
class GenerateProblem {
  static colloquialWords = {
    syllabary: {
      h: {
        a: {a: "あ", i: "い", u: "う", e: "え", o: "お"},
        k: {a: "か", i: "き", u: "く", e: "け", o: "こ"},
        g: {a: "が", i: "ぎ", u: "ぐ", e: "げ", o: "ご"},
        s: {a: "さ", i: "し", u: "す", e: "せ", o: "そ"},
        z: {a: "ざ", i: "じ", u: "ず", e: "ぜ", o: "ぞ"},
        t: {a: "た", i: "ち", u: "つ", e: "て", o: "と"},
        d: {a: "だ", i: "ぢ", u: "づ", e: "で", o: "ど"},
        n: {a: "な", i: "に", u: "ぬ", e: "ね", o: "の"},
        h: {a: "は", i: "ひ", u: "ふ", e: "へ", o: "ほ"},
        b: {a: "ば", i: "び", u: "ぶ", e: "べ", o: "ぼ"},
        p: {a: "ぱ", i: "ぴ", u: "ぷ", e: "ぺ", o: "ぽ"},
        m: {a: "ま", i: "み", u: "む", e: "め", o: "も"},
        y: {a: "や", i: "い", u: "ゆ", e: "え", o: "よ"},
        r: {a: "ら", i: "り", u: "る", e: "れ", o: "ろ"},
        w: {a: "わ", i: "い", u: "う", e: "え", o: "お"}
      },
      k: {
        a: {a: "ア", i: "イ", u: "ウ", e: "エ", o: "オ"},
        k: {a: "カ", i: "キ", u: "ク", e: "ケ", o: "コ"},
        g: {a: "ガ", i: "ギ", u: "グ", e: "ゲ", o: "ゴ"},
        s: {a: "サ", i: "シ", u: "ス", e: "セ", o: "ソ"},
        z: {a: "ザ", i: "ジ", u: "ズ", e: "ゼ", o: "ゾ"},
        t: {a: "タ", i: "チ", u: "ツ", e: "テ", o: "ト"},
        d: {a: "ダ", i: "ヂ", u: "ヅ", e: "デ", o: "ド"},
        n: {a: "ナ", i: "ニ", u: "ヌ", e: "ネ", o: "ノ"},
        h: {a: "ハ", i: "ヒ", u: "フ", e: "ヘ", o: "ホ"},
        b: {a: "バ", i: "ビ", u: "ブ", e: "ベ", o: "ボ"},
        p: {a: "パ", i: "ピ", u: "プ", e: "ペ", o: "ポ"},
        m: {a: "マ", i: "ミ", u: "ム", e: "メ", o: "モ"},
        y: {a: "ヤ", i: "イ", u: "ユ", e: "エ", o: "ヨ"},
        r: {a: "ラ", i: "リ", u: "ル", e: "レ", o: "ロ"},
        w: {a: "ワ", i: "イ", u: "ウ", e: "エ", o: "オ"}
      }
    },
    conjugationForm: {pt: "未然形", ct: "連用形", cc: "終止形", cj: "連体形", cd: "仮定形", ip: "命令形"},
    verbTypesOfConjugation: {5: "五段活用", u1: "上一段活用", l1: "下一段活用", ik: "カ行変格活用", is: "サ行変格活用"},
    verb: [//kind1→自動詞　kind2→他動詞　kind3→自動詞且他動詞
      {id: "動く", type: "5", row: "k", kind: 1, pair: "動かす"},
      {id: "置く", type: "5", row: "k", kind: 2},
      {id: "解く", type: "5", row: "k", kind: 2, pair: "解ける"},
      {id: "響く", type: "5", row: "k", kind: 1, pair: "響かす"},
      {id: "担ぐ", type: "5", row: "g", kind: 2},
      {id: "仰ぐ", type: "5", row: "g", kind: 2},
      {id: "探す", type: "5", row: "s", kind: 2},
      {id: "倒す", type: "5", row: "s", kind: 2, pair: "倒れる"},
      {id: "潰す", type: "5", row: "s", kind: 2, pair: "潰れる"},
      {id: "出す", type: "5", row: "s", kind: 2, pair: "出る"},
      {id: "揺らす", type: "5", row: "s", kind: 2, pair: "揺れる"},
      {id: "離す", type: "5", row: "s", kind: 2, pair: "離れる"},
      {id: "任す", type: "5", row: "s", kind: 2, pair: "任せる"},
      {id: "勝つ", type: "5", row: "t", kind: 1},
      {id: "持つ", type: "5", row: "t", kind: 3},
      {id: "死ぬ", type: "5", row: "n", kind: 1},
      {id: "転ぶ", type: "5", row: "b", kind: 1, pair: "転ばす"},
      {id: "飛ぶ", type: "5", row: "b", kind: 1, pair: "飛ばす"},
      {id: "楽しむ", type: "5", row: "m", kind: 2},
      {id: "沈む", type: "5", row: "m", kind: 1, pair: "沈める"},
      {id: "巡る", type: "5", row: "r", kind: 3},
      {id: "殴る", type: "5", row: "r", kind: 2},
      {id: "黙る", type: "5", row: "r", kind: 1, pair: "黙らす"},
      {id: "帰る", type: "5", row: "r", kind: 1, pair: "帰らす"},
      {id: "知る", type: "5", row: "r", kind: 2, pair: "知らす"},
      {id: "塗る", type: "5", row: "r", kind: 2},
      {id: "居る", type: "5", row: "r", kind: 1},
      {id: "重なる", type: "5", row: "r", kind: 1, pair: "重ねる"},
      {id: "成る", type: "5", row: "r", kind: 1, pair: "成す"},
      {id: "終わる", type: "5", row: "r", kind: 1, pair: "終える"},
      {id: "祈る", type: "5", row: "r", kind: 2},
      {id: "買う", type: "5", row: "w", kind: 2},
      {id: "笑う", type: "5", row: "w", kind: 3},
      {id: "叶う", type: "5", row: "w", kind: 1, pair: "叶える"},
      {id: "仕舞う", type: "5", row: "w", kind: 2},
      {id: "言う", type: "5", row: "w", kind: 2},
      {id: "吸う", type: "5", row: "w", kind: 2},
      {id: "従う", type: "5", row: "w", kind: 1},
      {id: "拾う", type: "5", row: "w", kind: 2},
      {id: "願う", type: "5", row: "w", kind: 2},
      {id: "縫う", type: "5", row: "w", kind: 2},
      {id: "信じる", type: "u1", row: "z", kind: 2},
      {id: "煮る", type: "u1", row: "n", kind: 2},
      {id: "見る", type: "u1", row: "m", kind: 2},
      {id: "尋ねる", type: "l1", row: "n", kind: 2},
      {id: "来る", type: "i", row: "k", kind: 1},
      {id: "する", type: "i", row: "s", kind: 2},
      {id: "行動する", type: "i", row: "s"},
      {id: "詮索する", type: "i", row: "s"},
      {id: "勉強する", type: "i", row: "s"},
      {id: "解体する", type: "i", row: "s"},
      {id: "創造する", type: "i", row: "s"},
    ],
    adjective: ["美しい", "小さい", "大きい", "長い", "短い", "楽しい", "暗い", "赤い", "可愛い"],
    adjectiveVerb: {},
    noun: {},
    adnominal: {},
    adverb: {},
    conjunction: {},
    interjection: {},
    perticle: {},
    auxiliaryVerb: {},
    //conjugation→pt, ct, cc, cj, cd, ip
    verbConjugation: {
      5: {
        k: {pt: ["か", "こ"], ct: ["き", "い"], cc: ["く"], cj: ["く"], cd: ["け"], ip: ["け"]},
        g: {pt: ["が", "ご"], ct: ["ぎ", "い"], cc: ["ぐ"], cj: ["ぐ"], cd: ["げ"], ip: ["げ"]},
        s: {pt: ["さ", "そ"], ct: ["し"], cc: ["す"], cj: ["す"], cd: ["せ"], ip: ["せ"]},
        t: {pt: ["た", "と"], ct: ["ち", "っ"], cc: ["つ"], cj: ["つ"], cd: ["て"], ip: ["て"]},
        n: {pt: ["な", "の"], ct: ["に", "ん"], cc: ["ぬ"], cj: ["ぬ"], cd: ["ね"], ip: ["ね"]},
        b: {pt: ["ば", "ぼ"], ct: ["び", "ん"], cc: ["ぶ"], cj: ["ぶ"], cd: ["べ"], ip: ["べ"]},
        m: {pt: ["ま", "も"], ct: ["み", "ん"], cc: ["む"], cj: ["む"], cd: ["め"], ip: ["め"]},
        r: {pt: ["ら", "ろ"], ct: ["り", "っ"], cc: ["る"], cj: ["る"], cd: ["れ"], ip: ["れ"]},
        w: {pt: ["わ", "お"], ct: ["い", "っ"], cc: ["う"], cj: ["う"], cd: ["え"], ip: ["え"]}
      },
      u1: {
        z: {pt: ["じ"], ct: ["じ"], cc: ["じる"], cj: ["じる"], cd: ["じれ"], ip: ["じろ", "じよ"]},
        n: {pt: ["に"], ct: ["に"], cc: ["にる"], cj: ["にる"], cd: ["にれ"], ip: ["にろ", "によ"]},
        m: {pt: ["み"], ct: ["み"], cc: ["みる"], cj: ["みる"], cd: ["みれ"], ip: ["みろ", "みよ"]}
      },
      l1: {
        n: {pt: ["ね"], ct: ["ね"], cc: ["ねる"], cj: ["ねる"], cd: ["ねれ"], ip: ["ねろ", "ねよ"]}
      },
      i: {
        k: {pt: ["こ"], ct: ["き"], cc: ["くる"], cj: ["くる"], cd: ["くれ"], ip: ["こい"]},
        s: {pt: ["さ", "し", "せ"], ct: ["し"], cc: ["する"], cj: ["する"], cd: ["すれ"], ip: ["しろ", "せよ"]}
      }
    },
    adjectiveConjugation: {pt: ["かろ"], ct: ["かっ", "く", "う"], cc: ["い"], cj: ["い"], cd: ["けれ"], ip: []}
  };
  static colloquialWordsPlus = {
    all: [...this.colloquialWords.verb],
    verb: {
      five: this.colloquialWords.verb.filter(word => {return word.type === "5"}),
      upper1: this.colloquialWords.verb.filter(word => {return word.type === "u1"}),
      lower1: this.colloquialWords.verb.filter(word => {return word.type === "l1"}),
      irrK: this.colloquialWords.verb.filter(word => {return word.type === "i" && word.row === "k"}),
      irrS: this.colloquialWords.verb.filter(word => {return word.type === "i" && word.row === "s"})
    }
  };
  static searchColloquialWord(word) {
    return this.colloquialWordsPlus.all.filter(w => {return w.id === word});
  };
  static generate(type, obj) {
    if (type === "JJLGPIIV") {
      if (obj.name === "type") {
        let arr = this.colloquialWordsPlus.verb.irrS;
        switch (obj.value) {
          case "5":
            arr = this.colloquialWordsPlus.verb.five;
            break;
          case "u1":
            arr = this.colloquialWordsPlus.verb.upper1;
            break;
          case "l1":
            arr = this.colloquialWordsPlus.verb.lower1;
            break;
          case "ik":
            arr = this.colloquialWordsPlus.verb.irrK;
            break;
        }
        const item = arr[Math.floor(Math.random() * arr.length)];
        return {question: "「" + item.id + "」の活用の種類は?", answer: this.colloquialWords.verbTypesOfConjugation[obj.value]};
      } else if (obj.name === "conjugation") {
        let arr = this.colloquialWordsPlus.verb.irrS;
        switch (obj.value) {
          case "5":
            arr = this.colloquialWordsPlus.verb.five;
            break;
          case "u1":
            arr = this.colloquialWordsPlus.verb.upper1;
            break;
          case "l1":
            arr = this.colloquialWordsPlus.verb.lower1;
            break;
          case "ik":
            arr = this.colloquialWordsPlus.verb.irrK;
            break;
        }
        const item = arr[Math.floor(Math.random() * arr.length)];
        const row = item.row;
        let ans;
        if (obj.value === "ik" || obj.value === "is") {
          ans = [this.colloquialWords.syllabary.k[row].a + "行変格活用", this.colloquialWords.syllabary.k[row].a + "変"];
        } else if (obj.value === "5" && item.row === "w") {
          ans = ["ワ行五段活用", "アワ行五段活用", "ワア行五段活用", "ア・ワ行五段活用", "ワ・ア行五段活用", "ア･ワ行五段活用", "ワ･ア行五段活用"];
        } else {
          console.log(row, this.colloquialWords.syllabary.k[row]);
          ans = this.colloquialWords.syllabary.k[row].a + "行" + this.colloquialWords.verbTypesOfConjugation[obj.value];
        }
        return {question: "「" + item.id + "」は何行何活用?", answer: ans, hideOther: true};
      }
    }
  }
}
console.log(GenerateProblem.colloquialWordsPlus.verb.five);
class Color {
  /**
   * 
   * @param {string} hex 
   * @returns {{h: number, s: number, l: number}}
   */
  static hexToHsl(hex) {
    hex = hex.replace(/^#/, "");
    if (hex.length === 3) {
      hex = hex.split("").map(char => char + char).join("");
    }
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;
    if (max === min) {
      h = 0;
      s = 0;
    } else {
      const delta = max - min;
      s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);
      switch (max) {
        case r:
          h = ((g - b) / delta + (g < b ? 6 : 0));
          break;
        case g:
          h = ((b - r) / delta + 2);
          break;
        case b:
          h = ((r - g) / delta + 4);
          break;
      }
      h = h / 6;
    }
    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  }
  /**
   * @param {number} h
   * @param {number} s
   * @param {number} l
   * @returns {string}
   */
  static hslToHex(h, s, l) {
    s /= 100;
    l /= 100;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;
    let r, g, b;
    if (h < 60) {
      r = c; g = x; b = 0;
    } else if (h < 120) {
      r = x; g = c; b = 0;
    } else if (h < 180) {
      r = 0; g = c; b = x;
    } else if (h < 240) {
      r = 0; g = x; b = c;
    } else if (h < 300) {
      r = x; g = 0; b = c;
    } else {
      r = c; g = 0; b = x;
    }
    /**
     * @param {number} n
     * @returns {string}
     */
    const toHex = (n) => {
      return Math.round((n + m) * 255).toString(16).padStart(2, "0");
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }
  /**
   * @param {string} hex
   * @param {number | undefined | null} [amount]
   * @param {number} [multi]
   * @param {number} [plus]
   * @returns {string}
   */
  static darkenColor(hex, amount, multi, plus) {
    const hsl = this.hexToHsl(hex);
    if (amount === undefined || amount === null) {
      amount = Math.round((hsl.l / 100) * (multi ?? 25) + (plus ?? 5));
    }
    hsl.l = Math.min(100, Math.max(0, hsl.l - amount));
    return this.hslToHex(hsl.h, hsl.s, hsl.l);
  }
  /** 
   * @param {string} hex
   * @param {number | undefined | null} [amount]
   * @param {number} [multi]
   * @param {number} [minus]
   * @returns {string}
   */
  static lightenColor(hex, amount, multi, minus) {
    const hsl = this.hexToHsl(hex);
    if (amount === undefined || amount === null) {
      amount = Math.round((1 - (hsl.l / 100)) * (multi ?? 25) - (minus ?? 5));
    }
    hsl.l = Math.max(0, Math.min(100, hsl.l + amount));
    return this.hslToHex(hsl.h, hsl.s, hsl.l);
  }
}
class Creates {
  /** 
   * @param {HTMLImageElement} img 
   * @param {number} x
   * @param {number} y
   * @param {Character} character
   * @param {{borderColor?: string, borderWidth?: number, textColor?: string, textBorder?: string, textBorderWidth?: number}} obj
   */
  static newCharacterFrame(img, x, y, character, obj = {}) {
    const elements = {update: {}, draw: {
      border: {name: "border", borderColor: obj.borderColor ?? "green", borderWidth: obj.borderWidth ?? 2, x: x, y: y, width: 275, height: 180},
      img: {name: "img", img: img, x: x + 10, y: y + 10, width: 120},
      ownName: {name: "text", fillColor: obj.textColor ?? "black", borderColor: obj.textBorder ?? "black", borderWidth: obj.textBorderWidth ?? 0, text: character.ability.name, x: x + 140, y: y + 20},
      hpText: {name: "text", fillColor: obj.textColor ?? "black", borderColor: obj.textBorder ?? "black", borderWidth: obj.textBorderWidth ?? 0, text: displayNames.hp + ":", x: x + 140, y: y + 50},
      hpNumber: {name: "text", fillColor: obj.textColor ?? "black", borderColor: obj.textBorder ?? "black", borderWidth: obj.textBorderWidth ?? 0, text: String(character.ability.hp.now) + " / " + String(character.ability.hp.max), x: x + 155, y: y + 80},
      mpText: {name: "text", fillColor: obj.textColor ?? "black", borderColor: obj.textBorder ?? "black", borderWidth: obj.textBorderWidth ?? 0, text: displayNames.mp + ":", x: x + 140, y: y + 110},
      mpNumber: {name: "text", fillColor: obj.textColor ?? "black", borderColor: obj.textBorder ?? "black", borderWidth: obj.textBorderWidth ?? 0, text: character.ability.mp.now + " / " + character.ability.mp.max, x: x + 155, y: y + 140},
      backHpBar: {name: "rect", fillColor: "red", borderColor: "black", borderWidth: 1, x: x + 185, y: y + 40, width: 75, height: 20},
      frontHpBar: {name: "rect", fillColor: "green", borderColor: "black", borderWidth: 1, x: x + 185, y: y + 40, width: 75 * character.ability.hp.now / character.ability.hp.max, height: 20},
      backMpBar: {name: "rect", fillColor: "rgb(178, 178, 178)", borderColor: "black", borderWidth: 1, x: x + 185, y: y + 100, width: 75, height: 20},
      frontMpBar: {name: "rect", fillColor: "cyan", borderColor: "black", borderWidth: 1, x: x + 185, y: y + 100, width: 75 * character.ability.mp.now / character.ability.mp.max, height: 20}
    }};
    mainArray.push(elements);
    return elements;
  }
  /**
   * @param {"normal" | "switchOutset" | "back"} type
   * @param {string} text
   * @param {number} x
   * @param {number} y
   * @param {number} width
   * @param {number} height
   * @param {{backgroundColor?: string, borderColor?: string, borderWidth?: number, textColor?: string, textBorder?: string, textBorderWidth?: number, aroundColor?: string, aroundWidth?: number, isPush?: boolean, font?: string, type?: string, isDelete?: boolean, newEvent?: Object, extention?: number}} obj
   */
  static newButton(type, text, x, y, width, height, obj = {}) {
    let elements = {update: {}, draw: {}};
    if (type === "normal") {
      ctx.fillStyle = obj.backgroundColor ?? "white";
      obj.backgroundColor = ctx.fillStyle;
      const drawElements = [
        {name: "rect", fillColor: obj.backgroundColor, borderColor: obj.borderColor ?? "black", borderWidth: obj.borderWidth ?? 0, x: x, y: y, width: width, height: height},
        {name: "text", fillColor: obj.textColor ?? "black", borderColor: obj.textBorder ?? "black", borderWidth: obj.textBorderWidth ?? 0, text: text, x: x + width / 2, y: y + height / 2, textAlign: "center"}
      ];
      elements = {
        update: {name: "btn", type: "normal", color: drawElements[0].fillColor, isDark: false},
        draw: {rect: drawElements[0], text: drawElements[1]}
      };
    } else if (type === "switchOutset") {
      ctx.fillStyle = obj.aroundColor ?? "white";
      let color = ctx.fillStyle;
      let darkerColor = Color.darkenColor(color);
      const aroundWidth = obj.aroundWidth ?? 1;
      const drawElements = [
        {name: "poly", fillColor: darkerColor, borderColor: transparent, borderWidth: 0, locations: [[x + width, y], [x + width, y + height], [x, y + height], [x + aroundWidth, y + height - aroundWidth], [x + width - aroundWidth, y + height - aroundWidth], [x + width - aroundWidth, y + aroundWidth]]},
        {name: "poly", fillColor: color, borderColor: transparent, borderWidth: 0, locations: [[x, y], [x + width, y], [x + width - aroundWidth, y + aroundWidth], [x + aroundWidth, y + aroundWidth], [x + aroundWidth, y + height - aroundWidth], [x, y + height]]},
        {name: "rect", fillColor: obj.backgroundColor ?? "white", borderColor: obj.borderColor ?? transparent, bordrWidth: obj.borderWidth ?? 0, x: x + aroundWidth, y: y + aroundWidth, width: width - 2 * aroundWidth, height: height - 2 * aroundWidth},
        {name: "text", fillColor: obj.textColor ?? "black", borderColor: obj.textBorder ?? "black", borderWidth: obj.textBorderWidth ?? 0, text: text, x: x + width / 2, y: y + height / 2, font: obj.font ?? "normal 25px " + fontType, textAlign: "center"}
      ];
      elements = {
        update: {name: "switchOutset", type: obj.type ?? undefined, isTouch: false, isPushed: false, newEvent: obj.newEvent ?? false, isDelete: obj.isDelete ?? false},
        draw: {lower: drawElements[0], upper: drawElements[1], rect: drawElements[2], text: drawElements[3]}
      };
    } else if (type === "back") {
      ctx.fillStyle = obj.backgroundColor ?? "white";
      obj.backgroundColor = ctx.fillStyle;
      const drawElements = [
        {name: "poly", fillColor: obj.backgroundColor, borderColor: obj.borderColor ?? "black", borderWidth: obj.borderWidth ?? 0, locations: [[x, y], [x + width, y], [x + width, y + height], [x, y + height], [x - (obj.extention ?? 10), y + height / 2]]},
        {name: "text", fillColor: obj.textColor ?? "black", borderColor: obj.textBorder ?? "black", borderWidth: obj.textBorderWidth ?? 0, text: text, x: x + width / 2, y: y + height / 2, textAlign: "center"}
      ];
      elements = {
        update: {name: "btn", type: "back", color: drawElements[0].fillColor, isDark: false},
        draw: {rect: drawElements[0], text: drawElements[1]}
      };
    }
    if (obj.isPush ?? true) mainArray.push(elements);
    return elements;
  }
  /**
   * @param {number} x
   * @param {number} y
   * @param {number} width
   * @param {number} height
   * @param {string[]} texts
   * @param {number} textWidth
   */
  static newMenu(x, y, width, height, texts, textWidth, obj = {}) {
    const elements = [{update: {}, draw: {name: "border", borderColor: "black", borderWidth: 1, x: x, y: y, width: width, height: height}}];
    for (let i = 0; i < texts.length && i < 6; i++) {
      elements.push(this.newButton("normal", texts[i], (!Boolean(i % 2) ? x + (width - textWidth * 2) / 3 : x + (width * 2 - textWidth) / 3), y + height / 9 * (Math.floor(i / 2) * 2 + 1), textWidth, height / 9, {backgroundColor: "#EEEEEE", isPush: false}));
    }
    elements.push(this.newButton("back", "back", x + (width - textWidth * 2) / 3, y + height / 9 * 7, 40, height / 9, {backgroundColor: "#EEEEEE", isPush: false}));
    if (obj.isPush ?? true) mainArray.splice(mainArray.length, 0, ...elements);
    return elements;
  }
}
/**
 * @param {number} x
 * @param {number} y
 * @param {number} width
 * @param {number} height
 * @param {number} extention
 * @param {number} pointX
 * @param {number} pointY
 */
function isInOfBack(x, y, width, height, extention, pointX, pointY) {
  if (pointX < x - extention || x + width < pointX || pointY < y || y + height < pointY) return false;
  if (x <= pointX) return true;
  return Math.abs(pointY - (y + height / 2)) <= (pointX - (x - extention)) * height / 2 / extention;
}
/**
 * @param {any[]} parent 
 * @param {*} child 
 * @returns 
 */
function searchArray(parent, child) {
  for (let i = 0; i < parent.length; i++) {
    if (parent[i] === child) return i;
  }
}
/**
 * @param {Record<string, any>} obj
 * @param {boolean} [deep=false]
 */
function deleteObj(obj, deep = false) {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (deep && typeof obj[key] === "object" && obj[key] !== null) {
        deleteObj(obj[key], true);
      }
    delete obj[key];
    }
  }
}
/**
 * @param {any[]} arr
 * @returns {any[]}
 */
function RandomArray(arr) {
  arr = arr.slice(0, arr.length);
  const newArr = [];
  while (arr.length) {
    const num = Math.floor(Math.random() * arr.length);
    newArr.push(arr[num]);
    arr.splice(num, 1);
  }
  return newArr;
}
/**
 * @param {string} latex
 * @param {function} callback
 * @returns {Image | undefined}
 */
const toRad = deg => deg * Math.PI / 180;
const toDeg = rad => rad * 180 / Math.PI;
function drawFormula(latex, callback) {
  if (typeof callback !== "function") {
    console.error("drawFormula: callback is required");
    return;
  }

  // 1. KaTeX SVG 出力
  const svgString = katex.renderToString(latex, { output: "svg", displayMode: true });
  console.log(svgString);
  const imgSrc = "data:image/svg+xml;base64," + encodeURIComponent(svgString);

  // 3. Image を生成
  const img = new Image();
  img.onload = function() {
    // 4. Canvas に描画
    const mathCanvas = document.createElement("canvas");
    mathCanvas.width = img.naturalWidth;
    mathCanvas.height = img.naturalHeight;
    const mathCtx = mathCanvas.getContext("2d");
    mathCtx.drawImage(img, 0, 0);
    // 5. コールバックで Canvas を返す
    callback(mathCanvas);
  };
  img.onerror = function(e) {
    console.error("drawFormula: Image load error", e);
  };
  img.src = imgSrc;
}
/**
 * @param {string} latex
 * @param {function} callback
 */
function drawFormula2(latex, callback) {
  MathJax.tex2svgPromise(latex, {display: true}).then((obj) => {
  let svg = new XMLSerializer().serializeToString(obj.querySelector("svg"));
  let svg_url = "data:image/svg+xml;charset=utf-8;," + encodeURIComponent(svg);
  /** @type {HTMLCanvasElement} */
  let cvs = document.createElement("canvas");
  let img = new Image();
  img.onload = () => {
    cvs.width = img.width;
    cvs.height = img.height;
    cvs.getContext("2d").drawImage(img, 0, 0);
    callback(cvs, img);
    }
  img.src = svg_url;
  });
}
function pushFunc(cvs, img, x, y, width, height=undefined) {
  mainArray.push({update: {}, draw: {name: "img", img, x, y, width, height: (height ? height : cvs.height / cvs.width * width)}});
}
//drawFormula2("\\begin{pmatrix} a_{11} & a_{12} & \\cdots & a_{1n} \\\\ a_{21} & a_{22} & \\cdots & a_{2n} \\\\ \\vdots & \\vdots & \\ddots & \\vdots \\\\ a_{m1} & a_{m2} & \\cdots & a_{mn} \\end{pmatrix} \\begin{pmatrix} b_{11} & b_{12} & \\cdots & b_{1p} \\\\ b_{21} & b_{22} & \\cdots & b_{2p} \\\\ \\vdots & \\vdots & \\ddots & \\vdots \\\\ b_{n1} & b_{n2} & \\cdots & b_{np} \\end{pmatrix} = \\begin{pmatrix} \\displaystyle \\sum_{k = 1}^n a_{1k} b_{k1} & \\displaystyle \\sum_{k = 1}^n a_{1k} b_{k2} & \\cdots & \\displaystyle \\sum_{k = 1}^n a_{1k} b_{kp} \\\\ \\displaystyle \\sum_{k = 1}^n a_{2k} b_{k1} & \\displaystyle \\sum_{k = 1}^n a_{2k} b_{k2} & \\cdots & \\displaystyle \\sum_{k = 1}^n a_{2k} b_{kp} \\\\ \\vdots & \\vdots & \\ddots & \\vdots \\\\ \\displaystyle \\sum_{k = 1}^n a_{mk} b_{k1} & \\displaystyle \\sum_{k = 1}^n a_{mk} b_{k2} & \\cdots & \\displaystyle \\sum_{k = 1}^n a_{mk} b_{kp} \\end{pmatrix}", function (mathCanvas, image) {mainArray.push({update: {}, draw: {name: "img", img: image, x: 700, y: 10, width: 300, height: mathCanvas.height / mathCanvas.width * 300}})});
//const btt = Creates.newButton("back", "tester", 400, 400, 200, 50, {backgroundColor: "#EEEEEE"});
//const menug = Creates.newMenu(700, 300, 200, 200, ["alpha α", "beta β", "gamma γ", "delta δ", "epsilon ε", "zeta ζ"], 80);
const crab = new Character({ name: "かに", hp: 150, def: 100});
const cat = new Character({ name: "猫", hp: 200, def: 100, speed: 150, magics: ["fire", "heal"], items: ["catfood"]});
const crabElems = Creates.newCharacterFrame(crabImg, 25, 100, crab);
const catElems = Creates.newCharacterFrame(catImg, 700, 100, cat);
const attackButton = Creates.newButton("switchOutset", displayNames.attack, 400, 100, 214, 45, { aroundColor: "red", aroundWidth: 7, type: "cmd" });
const magicButton = Creates.newButton("switchOutset", displayNames.magic, 400, 155, 214, 45, { aroundColor: "blue", aroundWidth: 7, type: "cmd" });
const itemButton = Creates.newButton("switchOutset", displayNames.item, 400, 210, 214, 45, { aroundColor: "green", aroundWidth: 7, type: "cmd" });
const defenseButton = Creates.newButton("switchOutset", displayNames.defense, 400, 265, 214, 45, { aroundColor: "yellow", aroundWidth: 7, type: "cmd" });
const timeNow = {name: "text", fillColor: "black", borderColor: "black", borderWidth: 0, text: "", x: 15, y: 15};
const fpsNow = {name: "text", fillColor: "black", borderColor: "black", borderWidth: 0, text: displayNames.fps + ": 0", x: 15, y: 35};
/*mainArray.push({update: {}, draw: {name: "border", x: 0, y: 100, width: 1000, height: 1}});
mainArray.push({update: {}, draw: {name: "border", x: 0, y: 280, width: 1000, height: 1}});
mainArray.push({update: {}, draw: {name: "border", x: 320, y: 0, width: 1, height: 525}});
mainArray.push({update: {}, draw: {name: "border", x: 680, y: 0, width: 1, height: 525}});*/
const angle = 120;//0<angle<360[deg]
const upperAngle = 120;
const lowerAngle = 150;
const upperTan = Math.tan(toRad(upperAngle));
const lowerTan = Math.tan(toRad(lowerAngle));
const intersectionX = 100 * (7 * (lowerTan + upperTan) - 1) / (upperTan + lowerTan);
const intersectionY = -upperTan * intersectionX + 700 * upperTan + 350;
//mainArray.push({update: {}, draw: {line: {name: "lines", x: [600, 800, 700, intersectionX, 700, 600, 800, 630, 620, 630, 630, 620, 630], y: [350, 350, 350, intersectionY, 450, 450, 450, 340, 350, 360, 440, 450, 460], exclusion: [2, 5, 7, 10], width: 2}, arcs: [{name: "arc", x: intersectionX, y: intersectionY, r: 15, start: Math.PI * 2 - toRad(upperAngle), end: toRad(lowerAngle)}, {name: "arc", x: 700, y: 350, r: 15, start: Math.PI - toRad(upperAngle), end: Math.PI}, {name: "arc", x: 700, y: 450, r: 15, start: Math.PI, end: Math.PI + toRad(lowerAngle)}], texts: [{name: "text", text: "x", x: intersectionX + 20, y: intersectionY + -(intersectionY - 400) * 0.2}, {name: "text", text: upperAngle + "°", x: 680, y: 330}, {name: "text", text: lowerAngle + "°", x: 680, y: 470}]}});
mainArray.push({update: {name: "time", second: -1, fpsCounter: 0}, draw: {time: timeNow, fps: fpsNow}
});
mainArray.push({update: {}, draw: [{name: "text", text: displayNames.enemy, x: 50, y: 300}, {name: "text", text: displayNames.you, x: 725, y: 300}]});
let isPointerIgnition = false;
let isPushing = false;
const mousePlace = [0, 0, 0, 0, 0, 0];
const mainOperations = {progress: false};
document.addEventListener("pointermove", function (event) {
  mousePlace[0] = event.clientX - canvas.getBoundingClientRect().left;
  mousePlace[1] = event.clientY - canvas.getBoundingClientRect().top;
});
document.addEventListener("pointerdown", function (event) {
  mousePlace[4] = 0;
  mousePlace[5] = 0;
  mousePlace[2] = event.clientX - canvas.getBoundingClientRect().left;
  mousePlace[3] = event.clientY - canvas.getBoundingClientRect().top;
  mousePlace[0] = mousePlace[2];
  mousePlace[1] = mousePlace[3];
  isPointerIgnition = true;
  isPushing = true;
});
document.addEventListener("pointerup", function (event) {
  mousePlace[4] = event.clientX - canvas.getBoundingClientRect().left;
  mousePlace[5] = event.clientY - canvas.getBoundingClientRect().top;
  isPointerIgnition = true;
  isPushing = false;
});
class Update {
  static verbConjugation = ["五段活用", "上一段活用", "下一段活用", "カ行変格活用", "サ行変格活用"];
  static conjugationForm = ["未然形", "連用形", "終止形", "連体形", "仮定形", "命令形"];
  static numberButtonVer0 = [{text: "1", color: "red"}, {text: "2", color: "orange"}, {text: "3", color: "yellow"}, {text: "4", color: "lightgreen"}, {text: "5", color: "green"}, {text: "6", color: "cyan"}, {text: "7", color: "blue"}, {text: "8", color: "purple"}, {text: "9", color: "pink"}, {text: "0", color: "lightgray"}];
  static allProblems = [
    {id: "JJLGPIIV001", name: "choice generate", grade: 2, generates: {name: "type", origin: true, value: "5"}, choices: this.verbConjugation},
    {id: "JJLGPIIV002", name: "choice generate", grade: 2, generates: {name: "type", origin: true, value: "u1"}, choices: this.verbConjugation},
    {id: "JJLGPIIV003", name: "choice generate", grade: 2, generates: {name: "type", origin: true, value: "l1"}, choices: this.verbConjugation},
    {id: "JJLGPIIV004", name: "choice generate", grade: 2, generates: {name: "type", origin: true, value: "ik"}, choices: this.verbConjugation},
    {id: "JJLGPIIV005", name: "choice generate", grade: 2, generates: {name: "type", origin: true, value: "is"}, choices: this.verbConjugation},
    {id: "JJLGPIIV006", name: "input generate", grade: 2, generates: {name: "conjugation", origin: true, value: "5"}},
    {id: "JJLGPAA001", name: "input", grade: 2, question: "「」内の助動詞の意味は?\n彼を向こうへ走ら「せる」", answer: "使役"},
    {id: "JJLGPAA002", name: "input", grade: 2, question: "「」内の助動詞の意味は?\n不要なものを捨て「させる」", answer: "使役"},
    {id: "JJLGPAA003", name: "input", grade: 2, question: "「」内の助動詞の意味は?\nすぐに行動さ「せる」", answer: "使役"},
    {id: "JJLGPAA004", name: "input", grade: 2, question: "「」内の助動詞の意味は?\nボールに遊ば「れる」", answer: "受け身"},
    {id: "JJLGPAA005", name: "input", grade: 2, question: "「」内の助動詞の意味は?\n大勢の観客から見「られ」た", answer: "受け身"},
    {id: "JJLGPAA006", name: "input", grade: 2, question: "「」内の助動詞の意味は?\n学生時代が偲ば「れる」", answer: "自発"},
    {id: "JJLGPAA007", name: "input", grade: 2, question: "「」内の助動詞の意味は?\n情熱が感じ「られる」作品", answer: "自発"},
    {id: "JJLGPAA008", name: "input", grade: 2, question: "「」内の助動詞の意味は?\n彼女になら尋ね「られる」", answer: "可能"},
    {id: "JJLGPAA009", name: "input", grade: 2, question: "「」内の助動詞の意味は?\n簡単には出「られ」ない", answer: "可能"},
    {id: "JJLGPAA010", name: "input", grade: 2, question: "「」内の助動詞の意味は?\n先方が帰ら「れる」", answer: "尊敬"},
    {id: "JJLGPAA011", name: "input", grade: 2, question: "「」内の助動詞の意味は?\n先生が御賽銭を入れ「られる」", answer: "尊敬"},
    {id: "JJLGPAA012", name: "input", grade: 2, question: "「」内の助動詞の意味は?\nここから逃げ出し「たい」", answer: "希望"},
    {id: "JJLGPAA013", name: "input", grade: 2, question: "「」内の助動詞の意味は?\nこの話の結末を知り「たい」", answer: "希望"},
    {id: "JJLGPAA014", name: "input", grade: 2, question: "「」内の助動詞の意味は?\n友達は外出し「たがる」", answer: "希望"},
    {id: "JJLGPAA015", name: "input", grade: 2, question: "「」内の助動詞の意味は?\n子供がカードを混ぜ「たがる」", answer: "希望"},
    {id: "JJLGPAA016", name: "input", grade: 2, question: "「」内の助動詞の意味は?\n先生の指示に従わ「ない」", answer: ["否定", "打ち消し", "打消"], hideOther: true},
    {id: "JJLGPAA017", name: "input", grade: 2, question: "「」内の助動詞の意味は?\n空気を察し「ない」人だ", answer: ["否定", "打ち消し", "打消"], hideOther: true},
    {id: "JJLGPAA018", name: "input", grade: 2, question: "「」内の助動詞の意味は?\nあの子は帰ら「ぬ」人となった", answer: ["否定", "打ち消し", "打消"], hideOther: true},
    {id: "JJLGPAA019", name: "input", grade: 2, question: "「」内の助動詞の意味は?\n知ら「ん」振りをする", answer: ["否定", "打ち消し", "打消"], hideOther: true},
    {id: "JJLGPAA020", name: "input", grade: 2, question: "「」内の助動詞の意味は?\nいい気味「だ」", answer: "断定"},
    {id: "JJLGPAA021", name: "input", grade: 2, question: "「」内の助動詞の意味は?\n美味しい「なら」食べたい", answer: "断定"},
    {id: "JJLGPAA022", name: "input", grade: 2, question: "「」内の助動詞の意味は?\n私達のチームが勝つ「だろ」う", answer: "断定"},
    {id: "JJLGPAA023", name: "input", grade: 2, question: "「」内の助動詞の意味は?\n疑うのは、最も恥ずべき悪徳「だ」", answer: "断定"},
    {id: "JJLGPAA024", name: "input", grade: 2, question: "「」内の助動詞の意味は?\n猫はとても可愛い「です」", answer: "断定"},
    {id: "JJLGPAA025", name: "input", grade: 2, question: "「」内の助動詞の意味は?\n太陽も既に真昼時「です」", answer: "断定"},
    {id: "JJLGPAA026", name: "input", grade: 2, question: "「」内の助動詞の意味は?\n何処までもついていき「ましょ」う", answer: "丁寧"},
    {id: "JJLGPAA027", name: "input", grade: 2, question: "「」内の助動詞の意味は?\n必ず、ここへ帰ってき「ます」", answer: "丁寧"},
    {id: "JJLGPAA028", name: "input", grade: 2, question: "「」内の助動詞の意味は?\n明日はもっと暖かかろ「う」", answer: "推量"},
    {id: "JJLGPAA029", name: "input", grade: 2, question: "「」内の助動詞の意味は?\nもう少ししたら富士山が見え「よう」", answer: "推量"},
    {id: "JJLGPAA030", name: "input", grade: 2, question: "「」内の助動詞の意味は?\n今から始め「よう」", answer: "意思"},
    {id: "JJLGPAA031", name: "input", grade: 2, question: "「」内の助動詞の意味は?\n何を書こ「う」か", answer: "意思"},
    {id: "JJLGPAA032", name: "input", grade: 2, question: "「」内の助動詞の意味は?\n異星にいこ「う」ね", answer: "勧誘"},
    {id: "JJLGPAA033", name: "input", grade: 2, question: "「」内の助動詞の意味は?\n貴女もここから出「よう」", answer: "勧誘"},
    {id: "JJLGPAA034", name: "input", grade: 2, question: "「」内の助動詞の意味は?\nメロスは激怒し「た」", answer: "過去"},
    {id: "JJLGPAA035", name: "input", grade: 2, question: "「」内の助動詞の意味は?\n先週駅の構内で転ん「だ」", answer: "過去"},
    {id: "JJLGPAA036", name: "input", grade: 2, question: "「」内の助動詞の意味は?\nようやくバスが到着し「た」", answer: "完了"},
    {id: "JJLGPAA037", name: "input", grade: 2, question: "「」内の助動詞の意味は?\nちょうど今解き終わっ「た」", answer: "完了"},
    {id: "JJLGPAA038", name: "input", grade: 2, question: "「」内の助動詞の意味は?\n死ん「だ」魚のような目をしている", answer: "存続"},
    {id: "JJLGPAA039", name: "input", grade: 2, question: "「」内の助動詞の意味は?\n割れたガラスの破片を集める", answer: "存続"},
    {id: "JJLGPAA040", name: "input", grade: 2, question: "「」内の助動詞の意味は?\n今日は32日でし「た」ね", answer: "確認"},
    {id: "JJLGPAA041", name: "input", grade: 2, question: "「」内の助動詞の意味は?\nこの先は行き止まりでし「た」ね", answer: "確認"},
    {id: "JJLGPAA042", name: "input", grade: 2, question: "「」内の助動詞の意味は?\n彼等はきっと許す「まい」", answer: [["否定", "打消", "打ち消し"], ["の", ""], "推量"], hideOther: true},
    {id: "JJLGPAA043", name: "input", grade: 2, question: "「」内の助動詞の意味は?\nこの灯はいつまでも消え「まい」", answer: [["否定", "打消", "打ち消し"], ["の", ""], "推量"], hideOther: true},
    {id: "JJLGPAA044", name: "input", grade: 2, question: "「」内の助動詞の意味は?\nここから先は通す「まい」", answer: [["否定", "打消", "打ち消し"], ["の", ""], "意志"], hideOther: true},
    {id: "JJLGPAA045", name: "input", grade: 2, question: "「」内の助動詞の意味は?\nこれ以上は何も言う「まい」", answer: [["否定", "打消", "打ち消し"], ["の", ""], "意志"], hideOther: true},
    {id: "JJLGPAA046", name: "input", grade: 2, question: "「」内の助動詞の意味は?\nこの建物は凄「そうだ」", answer: "様態"},
    /*
    {id: "JJLGPIIV001", name: "choice", grade: 2, question: "「動く」の活用の種類は?", choices: this.verbConjugation, answer: "五段活用"},
    {id: "JJLGPIIV002", name: "choice", grade: 2, question: "「走れ」の活用の種類は?", choices: this.verbConjugation, answer: "五段活用"},
    {id: "JJLGPIIV003", name: "choice", grade: 2, question: "「笑おう」の動詞の活用の種類は?", choices: this.verbConjugation, answer: "五段活用"},
    {id: "JJLGPIIV004", name: "input", grade: 2, question: "「担ぐ」は何行何活用?", answer: "ガ行五段活用"},
    {id: "JJLGPIIV005", name: "input", grade: 2, question: "「進んだ」の動詞は何行何活用?", answer: "マ行五段活用"},
    {id: "JJLGPIIV006", name: "input", grade: 2, question: "「黙れ」は何行何活用?", answer: "ラ行五段活用"},
    {id: "JJLGPIIV007", name: "choice", grade: 2, question: "「見る」の活用の種類は?", choices: this.verbConjugation, answer: "上一段活用"},
    {id: "JJLGPIIV008", name: "choice", grade: 2, question: "「尽きた」の動詞の活用の種類は?", choices: this.verbConjugation, answer: "上一段活用"},
    {id: "JJLGPIIV009", name: "choice", grade: 2, question: "「着ない」の動詞の活用の種類は?", choices: this.verbConjugation, answer: "上一段活用"},
    {id: "JJLGPIIV010", name: "input", grade: 2, question: "「降りる」は何行何活用?", answer: "ラ行上一段活用"},
    {id: "JJLGPIIV011", name: "input", grade: 2, question: "「煮れば」の動詞は何行何活用?", answer: "ナ行上一段活用"},
    {id: "JJLGPIIV012", name: "input", grade: 2, question: "「閉じよ」は何行何活用?", answer: "ザ行上一段活用"},
    {id: "JJLGPIIV013", name: "choice", grade: 2, question: "「動ける」の活用の種類は?", choices: this.verbConjugation, answer: "下一段活用"},
    {id: "JJLGPIIV014", name: "choice", grade: 2, question: "「捨てろ」の活用の種類は?", choices: this.verbConjugation, answer: "下一段活用"},
    {id: "JJLGPIIV015", name: "choice", grade: 2, question: "「出た」の動詞の活用の種類は?", choices: this.verbConjugation, answer: "下一段活用"},
    {id: "JJLGPIIV016", name: "input", grade: 2, question: "「寝る」は何行何活用?", answer: "ナ行下一段活用"},
    {id: "JJLGPIIV017", name: "input", grade: 2, question: "「食べよう」の動詞は何行何活用?", answer: "バ行下一段活用"},
    {id: "JJLGPIIV018", name: "input", grade: 2, question: "「出た」の動詞は何行何活用?", answer: "ダ行下一段活用"},
    {id: "JJLGPIIV019", name: "choice", grade: 2, question: "「来る」の活用の種類は?", choices: this.verbConjugation, answer: "カ行変格活用"},
    {id: "JJLGPIIV020", name: "input", grade: 2, question: "「来ない」の動詞は何行何活用?", answer: ["カ行変格活用", "カ変"], hideOther: true},
    {id: "JJLGPIIV021", name: "choice", grade: 2, question: "「する」の活用の種類は?", choices: this.verbConjugation, answer: "サ行変格活用"},
    {id: "JJLGPIIV022", name: "choice", grade: 2, question: "「勉強した」の動詞の活用の種類は?", choices: this.verbConjugation, answer: "サ行変格活用"},
    {id: "JJLGPIIV023", name: "input", grade: 2, question: "「しない」の動詞は何行何活用?", answer: ["サ行変格活用", "サ変"], hideOther: true},
    {id: "JJLGPIIV024", name: "input", grade: 2, question: "「行動せよ」は何行何活用?", answer: ["サ行変格活用", "サ変"], hideOther: true},
    {id: "JJLGPIIV025", name: "choice", grade: 2, question: "「喋らない」の動詞の活用形は?", choices: this.conjugationForm, answer: "未然形"},
    {id: "JJLGPIIV026", name: "choice", grade: 2, question: "「黙ろう」の動詞の活用形は?", choices: this.conjugationForm, answer: "未然形"},
    {id: "JJLGPIIV027", name: "choice", grade: 2, question: "「過ぎない」の動詞の活用形は?", choices: this.conjugationForm, answer: "未然形"},
    {id: "JJLGPIIV028", name: "choice", grade: 2, question: "「煮よう」の動詞の活用形は?", choices: this.conjugationForm, answer: "未然形"},
    {id: "JJLGPIIV029", name: "choice generate", grade: 2, generates: {name: "type", value: "5"}, choices: this.verbConjugation},
    {id: "JJLGPIIV030", name: "choice generate", grade: 2, generates: {name: "type", value: "u1"}, choices: this.verbConjugation},
    {id: "JJLGPIIV031", name: "choice generate", grade: 2, generates: {name: "type", value: "l1"}, choices: this.verbConjugation},*/
    {id: "JJCJH001", name: "input", grade: 2, question: "『平家物語』はいつつくられた?", answer: "鎌倉時代"},
    {id: "JJCJH002", name: "input", grade: 2, question: "『平家物語』のジャンルは?", answer: "軍記物語"},
    {id: "JJCJH003", name: "input", grade: 2, question: "『平家物語』は誰によって語られた?", answer: "琵琶法師"},
    {id: "JJCJH004", name: "input", grade: 2, question: "『平家物語』の琵琶法師による\n語りは何と呼ばれた?", answer: "平曲"},
    {id: "JJCJH005", name: "input", grade: 2, question: "『平家物語』の文体は?", answer: "和漢混交文"},
    {id: "JJCC001", name: "input", grade: 2, question: "唐代以前の漢詩は?", answer: "古体詩"},
    {id: "JJCC002", name: "input", grade: 2, question: "唐代以降の漢詩は?", answer: "近体詩"},
    {id: "JJCC003", name: "input", grade: 2, question: "絶句の句数は?", answer: ["4句", "４句", "四句", "4", "４", "四"], hideOther: true},
    {id: "JJCC004", name: "input", grade: 2, question: "律詩の句数は?", answer: ["8句", "８句", "八句", "8", "８", "八"], hideOther: true},
    {id: "JJCC005", name: "input", grade: 2, question: "律詩の1･2句目は?", answer: "首聯"},
    {id: "JJCC006", name: "input", grade: 2, question: "律詩の3･4句目は?", answer: "頷聯"},
    {id: "JJCC007", name: "input", grade: 2, question: "律詩の5･6句目は?", answer: "頸聯"},
    {id: "JJCC008", name: "input", grade: 2, question: "律詩の7･8句目は?", answer: "尾聯"},
    {id: "JJCC009", name: "choice", grade: 2, question: "五言詩の押韻の位置は?", choices: ["偶数句末", "偶数･初句末", "奇数句末", "奇数･2句末"], answer: "偶数句末"},
    {id: "JJCC010", name: "choice", grade: 2, question: "七言詩の押韻の位置は?", choices: ["偶数句末", "偶数･初句末", "奇数句末", "奇数･2句末"], answer: "偶数･初句末"},
    {id: "JEVP001", name: "input", grade: 2, question: "「~を笑う」の英語は?", answer: "laugh at"},
    {id: "JEVP002", name: "input", grade: 2, question: "「~に話しかける」の英語は?", answer: "speak to"},
    {id: "JEVP003", name: "input", grade: 2, question: "「~の世話をする」の英語(2単語)は?", answer: "look after"},
    {id: "JEVP004", name: "input", grade: 2, question: "「(車で)~を轢く」の英語は?", answer: "run over"},
    {id: "JEVP005", name: "input", grade: 2, question: "「~を切り倒す」の英語は?", answer: "cut down"},
    {id: "JEVP006", name: "input", grade: 2, question: "「~に驚く」の英語は?", answer: "be surprised at"},
    {id: "JEVP007", name: "input", grade: 2, question: "()に入るのは?\nCheese is made () milk.", answer: "from"},
    {id: "JEVP008", name: "input", grade: 2, question: "()に入るのは?\nThe table is made () wood.", answer: "of"},
    {id: "JEVP009", name: "input", grade: 2, question: "()に入るのは?\nTrees are made () paper.", answer: "into"},
    {id: "JEVP010", name: "input", grade: 2, question: "「~で覆われている」の英語は?", answer: "be covered with"},
    {id: "JEVP011", name: "input", grade: 2, question: "「~に知られている」の英語は?", answer: "be known to"},
    {id: "JEVP012", name: "input", grade: 2, question: "「~で知られている」の英語(受動態)は?", answer: "be known for"},
    {id: "JEVP013", name: "input", grade: 2, question: "「~でいっぱいである」の英語は?", answer: "be filled with"},
    {id: "JEVP014", name: "input", grade: 2, question: "「~が気に入っている」の英語は?", answer: "be pleased with"},
    {id: "JEVP015", name: "input", grade: 2, question: "「生まれる」の英語は?", answer: "be born"},
    {id: "JEVP016", name: "input", grade: 2, question: "「死ぬ」の英語(2単語)は?", answer: "be killed"},
    {id: "JEVP017", name: "input", grade: 2, question: "「怪我をする」の英語(受動態)は?", answer: "be injured"},
    {id: "JEVP018", name: "input", grade: 2, question: "「結婚している」の英語は?", answer: "be married"},
    {id: "JCBSAC001", name: "choice", grade: 2, question: "大動脈に含まれるのは?", choices: ["動脈血", "静脈血"], answer: "動脈血"},
    {id: "JCBSAC002", name: "choice", grade: 2, question: "大静脈に含まれるのは?", choices: ["動脈血", "静脈血"], answer: "静脈血"},
    {id: "JCBSAC003", name: "choice", grade: 2, question: "肺動脈に含まれるのは?", choices: ["動脈血", "静脈血"], answer: "静脈血"},
    {id: "JCBSAC004", name: "choice", grade: 2, question: "肺静脈に含まれるのは?", choices: ["動脈血", "静脈血"], answer: "動脈血"},
    {id: "JCBSAC005", name: "input", grade: 2, question: "血液が心臓から肺以外の\n全身を通り、心臓へと戻るまでの\n経路を何と言う?", answer: "体循環"},
    {id: "JCBSAC006", name: "input", grade: 2, question: "血液が心臓から肺を通り、心臓へと\n戻るまでの経路を何と言う?", answer: "肺循環"},
    {id: "JCBSAC007", name: "input", grade: 2, question: "酸素を多く含む血液を何と言う?", answer: "動脈血"},
    {id: "JCBSAC008", name: "input", grade: 2, question: "二酸化炭素を多く含む血液を何と言う?", answer: "静脈血"},
    {id: "JCBSAC009", name: "choice", grade: 2, question: "大静脈から血液を受け取るのは?", choices: ["右心房", "右心室", "左心房", "左心室"], answer: "右心房"},
    {id: "JCBSAC010", name: "choice", grade: 2, question: "肺へ血液を送るのは?", choices: ["右心房", "右心室", "左心房", "左心室"], answer: "右心室"},
    {id: "JCBSAC011", name: "choice", grade: 2, question: "肺から血液を受け取るのは?", choices: ["右心房", "右心室", "左心房", "左心室"], answer: "左心房"},
    {id: "JCBSAC012", name: "choice", grade: 2, question: "大動脈に血液を送るのは?", choices: ["右心房", "右心室", "左心房", "左心室"], answer: "左心室"},
    {id: "JCPCC001", name: "choice", grade: 2, question: "単位がAで表されるのは?", choices: ["電流", "電圧", "抵抗"], answer: "電流"},
    {id: "JCPCC002", name: "choice", grade: 2, question: "単位がVで表されるのは?", choices: ["電流", "電圧", "抵抗"], answer: "電圧"},
    {id: "JCPCC003", name: "choice", grade: 2, question: "単位がΩで表されるのは?", choices: ["電流", "電圧", "抵抗"], answer: "抵抗"},
    {id: "JCPCC004", name: "input", grade: 2, question: "回路を流れる電気の流れを何と言う?", answer: "電流"},
    {id: "JCPCC005", name: "input", grade: 2, question: "回路に電流を流そうとする力を何と言う?", answer: "電圧"},
    {id: "JCPCC006", name: "input", grade: 2, question: "電流を流れにくくする電子部品を何と言う?", answer: "抵抗器"},
    {id: "JCPCC007", name: "choice", grade: 2, question: "オームの法則の公式は?", choices: ["V=IR", "I=VR", "R=IV"], answer: "V=IR"},
    /*{id: "JCPCC008", name: "choice", grade: 2, question: ["これは何?", schematicSymbolsImg], choices: ["電源", "抵抗器", "スイッチ", "電流計", "電圧計", "電球"], answer: "電源装置", sprite: {x: 0, y: 0, width: 15, height: 15}},
    {id: "JCPCC009", name: "choice", grade: 2, question: ["これは何?", schematicSymbolsImg], choices: ["電源", "抵抗器", "スイッチ", "電流計", "電圧計", "電球"], answer: "抵抗器", sprite: {x: 15, y: 0, width: 15, height: 15}},
    {id: "JCPCC010", name: "choice", grade: 2, question: ["これは何?", schematicSymbolsImg], choices: ["電源", "抵抗器", "スイッチ", "電流計", "電圧計", "電球"], answer: "スイッチ", sprite: {x: 30, y: 0, width: 15, height: 15}},
    {id: "JCPCC011", name: "choice", grade: 2, question: ["これは何?", schematicSymbolsImg], choices: ["電源", "抵抗器", "スイッチ", "電流計", "電圧計", "電球"], answer: "電流計", sprite: {x: 0, y: 15, width: 15, height: 15}},
    {id: "JCPCC012", name: "choice", grade: 2, question: ["これは何?", schematicSymbolsImg], choices: ["電源", "抵抗器", "スイッチ", "電流計", "電圧計", "電球"], answer: "電圧計", sprite: {x: 15, y: 15, width: 15, height: 15}},
    {id: "JCPCC013", name: "choice", grade: 2, question: ["これは何?", schematicSymbolsImg], choices: ["電源", "抵抗器", "スイッチ", "電流計", "電圧計", "電球"], answer: "電球", sprite: {x: 30, y: 15, width: 15, height: 15}},
    {id: "JCPCC014", name: "choice", grade: 2, question: ["これは何?", schematicSymbolsImg], choices: ["電源", "電熱線", "スイッチ", "電流計", "電圧計", "電球"], answer: "電熱線", sprite: {x: 15, y: 0, width: 15, height: 15}},*/
    {id: "JCPCC015", name: "choice", grade: 2, question: "抵抗の大きさは抵抗の長さに()", choices: ["比例する", "反比例する"], answer: "比例する"},
    {id: "JCPCC016", name: "choice", grade: 2, question: "抵抗の大きさは抵抗の断面積に()", choices: ["比例する", "反比例する"], answer: "反比例する"},
    {id: "JCPCC017", name: "input", grade: 2, question: "抵抗が小さい物質を何と言う?", answer: "導体"},
    {id: "JCPCC018", name: "input", grade: 2, question: "ケイ素などの、電流を通したり\n通さなかったりする物質を何と言う?", answer: "半導体"},
    {id: "JCPCC019", name: "input", grade: 2, question: "抵抗が大きい物質を何と言う?", answer: ["不導体", "絶縁体"]},
    {id: "JCPCS001", name: "choice", grade: 2, question: "直列回路で回路全体に流れる電流の大きさは\n各抵抗器に流れる電流の大きさ()", choices: ["と等しい", "の和と等しい"], answer: "と等しい"},
    {id: "JCPCS002", name: "choice", grade: 2, question: "直列回路で回路全体の電圧の大きさは\n各抵抗器の電圧の大きさ()", choices: ["と等しい", "の和と等しい"], answer: "の和と等しい"},
    {id: "JCPCS003", name: "choice", grade: 2, question: "並列回路で回路全体に流れる電流の大きさは\n各抵抗器に流れる電流の大きさ()", choices: ["と等しい", "の和と等しい"], answer: "の和と等しい"},
    {id: "JCPCS004", name: "choice", grade: 2, question: "並列回路で回路全体の電圧の大きさは\n各抵抗器の電圧の大きさ()", choices: ["と等しい", "の和と等しい"], answer: "と等しい"},
    {id: "JSGJRYV001", name: "input", grade: 2, question: "中国地方と九州地方の間にある海峡は?", answer: "関門海峡"},
    {id: "JSGJRYV002", name: "input", grade: 2, question: "九州地方北部にある、\n九州最大の平野は?", answer: "筑紫平野"},
    {id: "JSGJRYV003", name: "input", grade: 2, question: "九州地方北部にある、\nなだらかな山地は?", answer: "筑紫山地"},
    {id: "JSGJRYV004", name: "input", grade: 2, question: "九州地方北部に流れる、\n九州最大の河川は?", answer: "筑後川"},
    {id: "JSGJRYV005", name: "input", grade: 2, question: "熊本県最大の河川は?", answer: "球磨川"},
    {id: "JSGJRYV006", name: "input", grade: 2, question: "九州中部にあるけわしい山地は?", answer: "九州山地"},
    {id: "JSGJRYV007", name: "input", grade: 2, question: "九州北西部にあり、\nのりが有名である湾は?", answer: "有明海"},
    {id: "JSGJRYV008", name: "input", grade: 2, question: "長崎市島原半島に\nある火山群の総称は?", answer: "雲仙岳"},
    {id: "JSGJRYV009", name: "input", grade: 2, question: "熊本県にあり、\nカルデラを伴う火山は?", answer: "阿蘇山"},
    {id: "JSGJRYV010", name: "input", grade: 2, question: "九州南東部の海沿いに広がる平野は?", answer: "宮崎平野"},
    {id: "JSGJRYV011", name: "input", grade: 2, question: "九州で2番目に広く、\n米とい草の二毛作が\n行われている平野は?", answer: "熊本平野"},
    {id: "JSGJRYV012", name: "input", grade: 2, question: "火山噴出物から\nなる土地を何と言う?", answer: "シラス台地"},
    {id: "JSGJRYV013", name: "input", grade: 2, question: "鹿児島県の西部\nにある半島は?", answer: "薩摩半島"},
    {id: "JSGJRYV014", name: "input", grade: 2, question: "鹿児島県の東部\nにある半島は?", answer: "大隅半島"},
    {id: "JSGJRYV015", name: "choice", grade: 2, question: "薩摩半島があるのは鹿児島県()", choices: ["東部", "西部"], answer: "西部"},
    {id: "JSGJRYV016", name: "choice", grade: 2, question: "大隅半島があるのは鹿児島県()", choices: ["東部", "西部"], answer: "東部"},
    {id: "JSGJRYV017", name: "input", grade: 2, question: "屋久島にある九州最高峰の山は?", answer: "宮之浦岳"},
    {id: "JSGJRYV018", name: "input", grade: 2, question: "大分県北東部にある半島は?", answer: "国東半島"},
    {id: "JSGJRYV019", name: "input", grade: 2, question: "大分県に連なる山の総称は?", answer: ["くじゅう連山", "九重連山"], hideOther: true},
    {id: "JSGJRYV020", name: "input", grade: 2, question: "火山の噴火などによってできた\n大きな窪地を何と言う?", answer: "カルデラ"},
    {id: "JSGJRYV021", name: "input", grade: 2, question: "大分にあり、地熱発電所が\n有名なのは?", answer: ["八丁原", "はっちょうばる"]},
    {id: "JSGJRYI001", name: "input", grade: 2, question: "傾斜地に階段状につくられた\n水田を何と言う?", answer: "棚田"},
    {id: "JSGJRYI002", name: "input", grade: 2, question: "灌漑用の水路を何と言う?", answer: "クリーク"},
    {id: "JSGJRSV001", name: "input", grade: 2, question: "中国地方にある代表的な砂丘は?", answer: "鳥取砂丘"},
    {id: "JSGJRSV002", name: "input", grade: 2, question: "中国地方を東西に走る\nなだらかな山地は?", answer: "中国山地"},
    {id: "JSGJRSV003", name: "input", grade: 2, question: "四国地方を東西に走る\n険しい山地は?", answer: "四国山地"},
    {id: "JSGJRSV004", name: "input", grade: 2, question: "島根県の北側にある諸島は?", answer: "隠岐諸島"},
    {id: "JSGJRSV005", name: "input", grade: 2, question: "中国地方南部にあり、\n三角州が広がる平野は?", answer: "広島平野"},
    {id: "JSGJRSV006", name: "input", grade: 2, question: "中国地方西部にある\n日本最大のカルスト台地は?", answer: "秋吉台"},
    {id: "JSGJRSV007", name: "input", grade: 2, question: "本州・四国・九州に\n囲まれた日本最大の\n内海は?", answer: "瀬戸内海"},
    {id: "JSGJRSV008", name: "input", grade: 2, question: "四国と九州に挟まれた海域は?", answer: "豊後水道"},
    {id: "JSGJRSV009", name: "input", grade: 2, question: "島根県北部の汽水湖は?", answer: "宍道湖"},
    {id: "JSGJRSV010", name: "input", grade: 2, question: "香川県北部にあり、ため池等の\n灌漑設備がある平野は?", answer: "讃岐平野"},
    {id: "JSGJRSV011", name: "input", grade: 2, question: "高知県南部にあり、野菜の\n促成栽培が行われている平野は?", answer: "高知平野"},
    {id: "JSGJRSV012", name: "choice", grade: 2, question: "中国地方の日本海側の地方は?", choices: ["山陰地方", "山陽地方", "北四国地方", "南四国地方", "瀬戸内地方"], answer: "山陰地方"},
    {id: "JSGJRSV013", name: "choice", grade: 2, question: "中国地方の瀬戸内海側の地方は?", choices: ["山陰地方", "山陽地方", "北四国地方", "南四国地方", "瀬戸内地方"], answer: "山陽地方"},
    {id: "JSGJRSV014", name: "choice", grade: 2, question: "四国地方の瀬戸内海側の地方は?", choices: ["山陰地方", "山陽地方", "北四国地方", "南四国地方", "瀬戸内地方"], answer: "北四国地方"},
    {id: "JSGJRSV015", name: "choice", grade: 2, question: "四国地方の太平洋側の地方は?", choices: ["山陰地方", "山陽地方", "北四国地方", "南四国地方", "瀬戸内地方"], answer: "南四国地方"},
    {id: "JSGJRSV016", name: "choice", grade: 2, question: "山陽地方と北四国地方を併せて何と言う?", choices: ["山陰地方", "山陽地方", "北四国地方", "南四国地方", "瀬戸内地方"], answer: "瀬戸内地方"},
    {id: "JSGJRSV017", name: "input", grade: 2, question: "本州と四国を繋ぐ\n橋を纏めて何と言う?", answer: "本州四国連絡橋"},
    {id: "JSGJRSV018", name: "input", grade: 2, question: "児島・坂出ルートの通称は?", answer: "瀬戸内海"},
    {id: "JSGJRSV019", name: "input", grade: 2, question: "神戸・鳴門ルートの内、\n神戸と淡路島を繋ぐのは?", answer: "明石海峡大橋"},
    {id: "JSGJRSV020", name: "input", grade: 2, question: "神戸・鳴門ルートの内、\n鳴門と淡路島を繋ぐのは?", answer: "大鳴門橋"},
    {id: "JSGJRSV021", name: "input", grade: 2, question: "尾道・今治ルートの通称は?", answer: ["瀬戸内しまなみ海道", "しまなみ海道", "西瀬戸自動車道"], hideOther: true},
    {id: "JSGJRSV022", name: "choice", grade: 2, question: "瀬戸大橋は?", choices: ["児島・坂出ルート", "神戸・鳴門ルート", "尾道・今治ルート"], answer: "児島・坂出ルート"},
    {id: "JSGJRSV023", name: "choice", grade: 2, question: "明石海峡大橋・大鳴門橋は?", choices: ["児島・坂出ルート", "神戸・鳴門ルート", "尾道・今治ルート"], answer: "神戸・鳴門ルート"},
    {id: "JSGJRSV024", name: "choice", grade: 2, question: "瀬戸内しまなみ海道は?", choices: ["児島・坂出ルート", "神戸・鳴門ルート", "尾道・今治ルート"], answer: "尾道・今治ルート"},
    {id: "JSGJRSV025", name: "input", grade: 2, question: "地方の政治や経済、文化の\n中心となる都市を何と言う?", answer: "地方中枢都市"},
    {id: "JSGJRSV026", name: "input", grade: 2, question: "平清盛によって造られた、\n広島県にある世界遺産の神社は?", answer: "厳島神社"},
    {id: "JSGJRSV027", name: "input", grade: 2, question: "広島にある平和記念碑で、\n世界遺産になっているのは?", answer: "原爆ドーム"},
    {id: "JSGJRSV028", name: "input", grade: 2, question: "恒久平和の象徴として、\n広島市を何と言う?", answer: "平和記念都市"},
    {id: "JSGJRSV029", name: "input", grade: 2, question: "徳島県と高知県を流れ、\n川幅が日本で2番目に広い河川は?", answer: "吉野川"},
    {id: "JSGJRSV030", name: "input", grade: 2, question: "交通網が整備される事により、\n地方から都市へ人口が移動し、\nかえって経済が衰退する現象は?", answer: "ストロー現象"},
    {id: "JSGJRSV031", name: "input", grade: 2, question: "新大阪駅から山陽地方を通って\n博多駅までを結ぶ新幹線は?", answer: "山陽新幹線"},
    {id: "JSGJRSV032", name: "input", grade: 2, question: "中国地方中部を東西に\n横断する自動車道は?", answer: "中国自動車道"},
    {id: "JSGJRSV033", name: "input", grade: 2, question: "中国地方の瀬戸内海側を\n東西に横断する自動車道は?", answer: "山陽自動車道"},
    {id: "JSGJRSI001", name: "input", grade: 2, question: "高知県では、ナスやピーマン等の\n野菜を()を行って育てている", answer: "促成栽培"},
    {id: "JSGJRSI002", name: "input", grade: 2, question: "香川県で水不足を解消する\nためにつくられた水路は?", answer: "香川用水"},
    {id: "JSGJRSI003", name: "input", grade: 2, question: "瀬戸内海周辺の工業地域は?", answer: "瀬戸内工業地域"},
    {id: "JSGJRAV001", name: "input", grade: 2, question: "関東地方の南に位置し、\n八丈島等を含む諸島は?", answer: "伊豆諸島"},
    {id: "JSGJRAV002", name: "input", grade: 2, question: "関東地方に冬に吹く、\n冷たく乾いた風を何と言う?", answer: ["からっ風", "空っ風"], hideOther: true},
    {id: "JSGJRAV003", name: "input", grade: 2, question: "群馬県の北西の県境に\n位置する山脈は?", answer: "越後山脈"},
    {id: "JSGJRAV004", name: "input", grade: 2, question: "日本最大の平野は?", answer: "関東平野"},
    {id: "JSGJRAV005", name: "input", grade: 2, question: "流域面積日本最大の川は?", answer: "利根川"},
    {id: "JSGJRAV006", name: "input", grade: 2, question: "群馬県にあり、天明大噴火で\n噴火した活火山は?", answer: "浅間山"},
    {id: "JSGJRAV007", name: "input", grade: 2, question: "関東地方西端にある山地は?", answer: "関東山地"},
    {id: "JSGJRAV008", name: "input", grade: 2, question: "茨城県にある、面積が日本で\n2番目に大きい湖は?", answer: "霞ヶ浦"},
    {id: "JSGJRAV009", name: "input", grade: 2, question: "一部が世界遺産となっている、\n東京都の諸島は?", answer: "小笠原諸島"},
    {id: "JSGJRAV010", name: "input", grade: 2, question: "千葉県の大部分を占める半島は?", answer: "房総半島"},
    {id: "JSGJRSI004", name: "input", grade: 2, question: "石油化学関係の工場が連携し、\nパイプラインで繋がれているのは?", answer: "石油化学コンビナート"},
    {id: "JSHPPC001", name: "choice", grade: 1, question: "旧石器時代に使われた、\n石を打って作る道具の名前は?", choices: ["打製石器", "磨製石器", "須恵器"], answer: "打製石器"},
    {id: "JSHPPB001", name: "choice", grade: 1, question: "日本に旧石器時代がある事を\n初めて明らかにした、\n群馬県の遺跡の名前は?", choices: ["岩宿遺跡", "野尻湖遺跡", "三内丸山遺跡", "吉野ケ里遺跡"], answer: "岩宿遺跡"},
    {id: "JSHPPB002", name: "choice", grade: 1, question: "沖縄県にある、旧石器時代の\n人骨や石器が出土した遺跡は?", choices: ["山下町洞穴", "岩宿遺跡", "野尻湖遺跡", "登呂遺跡"], answer: "山下町洞穴"},
    {id: "JSHPJC001", name: "choice", grade: 1, question: "縄文時代から使われた、\n表面を磨くことで作られた石器の名前は?", choices: ["磨製石器", "打製石器", "須恵器"], answer: "磨製石器"},
    {id: "JSHPJC002", name: "choice", grade: 1, question: "縄文時代の人々が食べた貝や魚の残り等が\n積もって出来たものは?", choices: ["貝塚", "縄文土器", "竪穴住居", "土偶"], answer: "貝塚"},
    {id: "JSHPJC003", name: "choice", grade: 1, question: "縄文時代頃に作られた、\n土製の人形は?", choices: ["土偶", "埴輪", "土器", "植木鉢"], answer: "土偶"},
    {id: "JSHPJB001", name: "choice", grade: 1, question: "地面を掘って作られた住居の名前は?", choices: ["高床住居", "高床倉庫", "竪穴住居", "堅穴住居"], answer: "竪穴住居"},
    {id: "JSHPJB002", name: "choice", grade: 1, question: "東京で、モースによって\n発見された遺跡の名前は?", choices: ["大森貝塚", "岩宿遺跡", "三内丸山遺跡", "吉野ケ里遺跡"], answer: "大森貝塚"},
    {id: "JSHPJB003", name: "choice", grade: 1, question: "青森県にある大規模な縄文時代の\n集落跡で、掘立柱建物や大型建物が\n見つかった遺跡は?", choices: ["三内丸山遺跡", "登呂遺跡", "岩宿遺跡", "吉野ケ里遺跡", "吉野狩遺跡"], answer: "三内丸山遺跡"},
    {id: "JSHPYP001", name: "choice", grade: 1, question: "弥生時代に、邪馬台国の女王として\n倭国を治めた人物は?", choices: ["卑弥呼", "推古天皇", "聖徳太子", "小野妹子", "小野小町"], answer: "卑弥呼"},
    {id: "JSHPYC001", name: "choice", grade: 1, question: "弥生時代に日本列島で普及し、\n人々の食生活や社会発展に\n大きく影響した作物は?", choices: ["稲", "大豆", "小麦", "大麦", "玉蜀黍"], answer: "稲"},
    {id: "JSHPYC002", name: "input", grade: 1, question: "漢委奴国王印(金印)が見つかった、\n福岡県の島の名前は?", answer: "志賀島"},
    {id: "JSHPYB001", name: "choice", grade: 1, question: "佐賀県にある、環濠や物見櫓が\n残る大規模な弥生時代の集落跡は?", choices: ["吉野ケ里遺跡", "吉野狩遺跡", "三内丸山遺跡", "岩宿遺跡", "登呂遺跡"], answer: "吉野ケ里遺跡"},
    {id: "JSHPYB002", name: "choice", grade: 1, question: "弥生時代頃に使われた、\n稲等を保管する建物は?", choices: ["高床倉庫", "竪穴住居", "竪穴倉庫", "古墳"], answer: "高床倉庫"},
    {id: "JSHAKP001", name: "choice", grade: 1, question: "後の天皇となる古墳時代の支配者は\n何と呼ばれていた?", choices: ["大王", "豪族", "貴族", "公家", "老中", "執権"], answer: "大王"},
    {id: "JSHAKS001", name: "choice", grade: 1, question: "古墳時代頃に近畿地方を中心として\n発展した政権は?", choices: ["大和政権", "平氏政権", "幕府", "朝廷"], answer: "大和政権"},
    {id: "JSHAKC001", name: "choice", grade: 1, question: "古墳の上に並べられた\n素焼きの人形の名前は?", choices: ["埴輪", "土偶", "植木鉢"], answer: "埴輪"},
    {id: "JSHAKB001", name: "choice", grade: 1, question: "大阪府にある、日本最大の古墳は?", choices: ["大仙陵古墳", "誉田御廟山古墳", "造山古墳", "今城塚古墳"], answer: "大仙陵古墳"},
    {id: "JSHAAP001", name: "choice", grade: 1, question: "推古天皇の摂政となった人物は?", choices: ["聖徳太子", "蘇我馬子", "蘇我入鹿", "中大兄皇子", "中臣鎌足"], answer: "聖徳太子"},
    {id: "JSHAAP002", name: "choice", grade: 1, question: "607年に隋に派遣された人物は?", choices: ["小野妹子", "遣隋使", "聖徳太子", "空海"], answer: "小野妹子"},
    {id: "JSHAAP003", name: "choice", grade: 1, question: "後の天智天皇である、\n大化の改新を行った人物は?", choices: ["中大兄皇子", "中臣鎌足", "藤原鎌足", "大海人皇子"], answer: "中大兄皇子"},
    {id: "JSHAAE001", name: "choice", grade: 1, question: "中大兄皇子と中臣鎌足が蘇我氏を倒して\n始まった政治改革は?", choices: ["大化の改新", "承久の乱", "壬申の乱", "建武の新政"], answer: "大化の改新"},
    {id: "JSHAAS001", name: "choice", grade: 1, question: "日本の最初の元号は?", choices: ["大化", "享保", "令和", "縄文"], answer: "大化"},
    {id: "JSHAAS001", name: "choice", grade: 1, question: "聖徳太子が制定した、\n役人の心構えを示したものは?", choices: ["十七条の憲法", "大日本帝国憲法", "日本国憲法", "冠位十二階"], answer: "十七条の憲法"},
    {id: "JSHAAS002", name: "choice", grade: 1, question: "土地や人々を天皇が\n直接支配する制度は?", choices: ["公地公民", "班田収授法", "大化の改新", "墾田永年私財法"], answer: "公地公民"},
    {id: "JSHAAS003", name: "choice", grade: 1, question: "聖徳太子が制定した、役人の\n能力や功績に応じて位階を与える制度は?", choices: ["冠位十二階", "十七条の憲法", "律令制度", "墾田永年私財法"], answer: "冠位十二階"},
    {id: "JSHAAS004", name: "choice", grade: 1, question: "日本最古の貨幣は?", choices: ["富本銭", "和同開珎", "永楽通宝", "寛永通宝"], answer: "富本銭"},
    {id: "JSHAAB001", name: "choice", grade: 1, question: "聖徳太子が建立した、\n残存する世界最古の木造建築物は?", choices: ["法隆寺", "唐招提寺", "東大寺", "延暦寺", "銀閣寺"], answer: "法隆寺"},
    {id: "JSHANP001", name: "choice", grade: 1, question: "仏教を広めるために来日し、\n唐招提寺を開いた僧は?", choices: ["鑑真", "行基", "空海", "最澄"], answer: "鑑真"},
    {id: "JSHANP002", name: "choice", grade: 1, question: "奈良時代、民衆と協力して\n橋や寺院、東大寺等を建設した僧は?", choices: ["行基", "鑑真", "空海", "最澄"], answer: "行基"},
    {id: "JSHANP003", name: "choice", grade: 1, question: "平城京に都を移した人物は?", choices: ["元明天皇", "聖武天皇", "桓武天皇", "持統天皇", "仁徳天皇", "平城天皇"], answer: "元明天皇"},
    {id: "JSHANS001", name: "choice", grade: 1, question: "日本で最初の流通貨幣は?", choices: ["和同開珎", "富本銭", "永楽通宝", "寛永通宝"], answer: "和同開珎"},
    {id: "JSHANS002", name: "choice", grade: 1, question: "隋に倣って701年に作られた政治体系は?", choices: ["大宝律令", "養老律令", "大日本帝国憲法", "冠位十二階"], answer: "大宝律令"},
    {id: "JSHANS003", name: "choice", grade: 1, question: "律令で、収穫した稲のおよそ3%を\n国に税として納めるものは?", choices: ["租", "調", "庸", "雑徭", "衛士", "防人"], answer: "租"},
    {id: "JSHANS004", name: "choice", grade: 1, question: "律令で、繊維製品や特産品を\n国に税として納めるものは?", choices: ["調", "租", "庸", "雑徭", "衛士", "防人"], answer: "調"},
    {id: "JSHANS005", name: "choice", grade: 1, question: "律令で、労役の代わりに\n布・米・塩などを国に\n税として納めるものは?", choices: ["庸", "租", "調", "雑徭", "衛士", "防人"], answer: "庸"},
    {id: "JSHANS006", name: "choice", grade: 1, question: "律令で、地方での労役を行うものは?", choices: ["雑徭", "租", "調", "庸", "衛士", "防人"], answer: "雑徭"},
    {id: "JSHANS007", name: "choice", grade: 1, question: "律令で、都での労役を行うものは?", choices: ["衛士", "租", "調", "庸", "雑徭", "防人"], answer: "衛士"},
    {id: "JSHANS008", name: "choice", grade: 1, question: "律令で、北九州での労役を行うものは?", choices: ["防人", "租", "調", "庸", "雑徭", "衛士"], answer: "防人"},
    {id: "JSHANS009", name: "input", grade: 1, question: "律令で、地方での労役を行うものは?", answer: "雑徭"},
    {id: "JSHANS010", name: "input", grade: 1, question: "律令で、都での労役を行うものは?", answer: "衛士"},
    {id: "JSHANS011", name: "input", grade: 1, question: "律令で、北九州での労役を行うものは?", answer: "防人"},
    {id: "JSHANC001", name: "choice", grade: 1, question: "日本最古の歴史書は?", choices: ["古事記", "日本書紀", "万葉集", "風土記"], answer: "古事記"},
    {id: "JSHANC002", name: "choice", grade: 1, question: "日本最古の、国が正式に作成した正史は?", choices: ["日本書紀", "古事記", "万葉集", "風土記"], answer: "日本書紀"},
    {id: "JSHANC003", name: "choice", grade: 1, question: "日本最古の和歌集は?", choices: ["万葉集", "古事記", "日本書紀", "古今和歌集"], answer: "万葉集"},
    {id: "JSHANC004", name: "choice", grade: 1, question: "奈良時代に各地の\n地理・産物・伝説などを\nまとめた記録は?", choices: ["風土記", "万葉集", "古事記", "日本書紀"], answer: "風土記"},
    {id: "JSHANC005", name: "choice", grade: 1, question: "奈良時代に栄えた、\n仏教の影響を強く受けた文化は?", choices: ["天平文化", "奈良文化", "寛永文化", "元禄文化"], answer: "天平文化"},
    {id: "JSHANC006", name: "choice", grade: 1, question: "貧窮問答歌を詠んだ人物は?", choices: ["山上憶良", "柿本人麻呂", "大伴家持", "小野小町"], answer: "山上憶良"},
    {id: "JSHANB001", name: "choice", grade: 1, question: "聖武天皇ゆかりの宝物を\n収めていた建物は?", choices: ["正倉院", "唐招提寺", "法隆寺", "東大寺"], answer: "正倉院"},
    {id: "JSHANB002", name: "choice", grade: 1, question: "聖武天皇によって、\n都に大仏と共に建てられた建物は?", choices: ["東大寺", "国分寺", "法隆寺", "唐招提寺"], answer: "東大寺"},
    {id: "JSHANB003", name: "choice", grade: 1, question: "聖武天皇によって、\n国ごとに建立された建物は?", choices: ["国分寺", "東大寺", "法隆寺", "唐招提寺"], answer: "国分寺"},
    {id: "JSHANB004", name: "choice", grade: 1, question: "奈良時代の都となったのは?", choices: ["平城京", "平安京", "長岡京", "奈良京"], answer: "平城京"},
    {id: "JSHANB005", name: "choice", grade: 1, question: "正倉院の建築様式は?", choices: ["校倉造", "寝殿造", "書院造", "数寄屋造"], answer: "校倉造"},
    {id: "JSHAHP001", name: "choice", grade: 1, question: "平安時代中期に、\n摂関政治で強い権力を持った人物は?", choices: ["藤原道長", "藤原頼通", "菅原道真", "源頼朝"], answer: "藤原道長"},
    {id: "JSHAHP002", name: "choice", grade: 1, question: "天台宗の開祖は?", choices: ["最澄", "空海", "鑑真", "行基"], answer: "最澄"},
    {id: "JSHAHP003", name: "choice", grade: 1, question: "真言宗の開祖は?", choices: ["空海", "最澄", "鑑真", "行基"], answer: "空海"},
    {id: "JSHAHP003", name: "choice", grade: 1, question: "平安初期に征夷大将軍に任命され、\n阿弖流為を倒した人物は?", choices: ["坂上田村麻呂", "坂之上田村麻呂", "源義経", "足利尊氏"], answer: "坂上田村麻呂"},
    {id: "JSHDHP004", name: "choice", grade: 1, question: "武士として初めて太政大臣となり、\n政権を握った人物は?", choices: ["平清盛", "源頼朝", "源義経", "北条時政"], answer: "平清盛"},
    {id: "JSHDHP005", name: "choice", grade: 1, question: "平安京に都を移した人物は?", choices: ["桓武天皇", "聖武天皇", "元明天皇", "持統天皇", "仁徳天皇", "藤原道長"], answer: "桓武天皇"},
    {id: "JSHAHE001", name: "choice", grade: 1, question: "1156年に起こった、\n皇位継承問題などの対立に源氏・平氏も\n加わって争った内乱は?", choices: ["保元の乱", "平治の乱", "承久の乱", "壬申の乱"], answer: "保元の乱"},
    {id: "JSHAHE002", name: "choice", grade: 1, question: "1159年に起こった、\n院政を巡る源氏・平氏の争いは?", choices: ["平治の乱", "保元の乱", "承久の乱", "壬申の乱"], answer: "平治の乱"},
    {id: "JSHAHC001", name: "choice", grade: 1, question: "開祖が最澄の仏教宗派は?", choices: ["天台宗", "真言宗", "浄土宗", "臨済宗"], answer: "天台宗"},
    {id: "JSHAHC002", name: "choice", grade: 1, question: "開祖が空海の仏教宗派は?", choices: ["真言宗", "天台宗", "浄土宗", "臨済宗"], answer: "真言宗"},
    {id: "JSHAHB001", name: "choice", grade: 1, question: "最澄は何処に何を建立した?", choices: ["比叡山延暦寺", "比叡山金剛峯寺", "高野山延暦寺", "高野山金剛峯寺"], answer: "比叡山延暦寺"},
    {id: "JSHAHB002", name: "choice", grade: 1, question: "空海は何処に何を建立した?", choices: ["高野山金剛峯寺", "高野山延暦寺", "比叡山金剛峯寺", "比叡山延暦寺"], answer: "高野山金剛峯寺"},
    {id: "JSHAHB003", name: "choice", grade: 1, question: "平安時代に建てられた、\n貴族の屋敷の建築様式は?", choices: ["寝殿造", "書院造", "校倉造", "数寄屋造"], answer: "寝殿造"},
    {id: "JSHDKP001", name: "choice", grade: 1, question: "鎌倉時代に将軍の補佐をし、\n政治の実権を握った役職は?", choices: ["執権", "管領", "老中", "六波羅探題", "政所", "大老"], answer: "執権"},
    {id: "JSHDMP001", name: "choice", grade: 2, question: "南北朝を統一した人物は?", choices: ["足利義満", "足利尊氏", "後醍醐天皇", "織田信長"], answer: "足利義満"},
    {id: "JSHDMP002", name: "choice", grade: 2, question: "室町時代に将軍の補佐をし、\n政治の実権を握った役職は?", choices: ["執権", "管領", "老中", "六波羅探題", "政所", "大老"], answer: "管領"},
    {id: "JSHDMB001", name: "choice", grade: 2, question: "足利義満によって建てられたのは?", choices: ["鹿苑寺金閣", "慈照寺銀閣", "東大寺", "清水寺"], answer: "鹿苑寺金閣"},
    {id: "JSHDMB002", name: "choice", grade: 2, question: "足利義政によって建てられたのは?", choices: ["慈照寺銀閣", "鹿苑寺金閣", "東大寺", "清水寺"], answer: "慈照寺銀閣"},
    {id: "JSHDMB003", name: "choice", grade: 2, question: "銀閣の東求堂同仁斎の建築様式は?", choices: ["書院造", "寝殿造", "校倉造", "数寄屋造"], answer: "書院造"},
    {id: "JSHEAP001", name: "choice", grade: 2, question: "室町幕府を滅ぼした人物は?", choices: ["織田信長", "豊臣秀吉", "徳川家康", "後醍醐天皇", "今川義元", "武田信玄"], answer: "織田信長"},
    {id: "JSHEAP002", name: "input", grade: 2, question: "日本に初めてキリスト教を伝えた宣教師は?", answer: ["フランシスコ＝ザビエル", "フランシスコ・ザビエル", "フランシスコザビエル", "フランシスコ=ザビエル"], hideOther: true},
    {id: "JSHEAP003", name: "input", grade: 2, question: "安土桃山時代頃にスペイン人や\nポルトガル人は何と呼ばれた?", answer: "南蛮人"},
    {id: "JSHEAP004", name: "input", grade: 2, question: "安土桃山時代にキリスト教の日本への\n布教を目的としてローマへ派遣された少年4人を\n中心とする使節は?", answer: ["天正遣欧使節", "天正遣欧少年使節", "天正少年使節"], hideOther: true},
    {id: "JSHEAE001", name: "input", grade: 2, question: "長篠の戦いで織田・徳川連合軍が\n大量に使った火器は?", answer: "鉄砲"},
    {id: "JSHEAE002", name: "input", grade: 2, question: "豊臣秀吉によって行われた、全国的な土地調査は?", answer: "太閤検地"},
    {id: "JSHEAE003", name: "input", grade: 2, question: "豊臣秀吉によって行われた、武士以外の\n身分からの武器の没収を何と言う?", answer: ["刀狩", "刀狩り"], hideOther: true},
    {id: "JSHEAE004", name: "input", grade: 2, question: "豊臣秀吉によって行われた、武士以外の\n身分の武器の所有を禁止する法令は?", answer: "刀狩令"},
    {id: "JSHEAS001", name: "input", grade: 2, question: "豊臣秀吉の行った政策により、\n身分が明確に分けられた事を\n何と言う?", answer: "兵農分離"},
    {id: "JSHEAS002", name: "input", grade: 2, question: "織田信長が出した、\n市場の繁栄を目的とする法令は?", answer: "楽市令"},
    {id: "JSHEAC001", name: "choice", grade: 2, question: "安土桃山時代頃にヨーロッパから\n入ってきた文化は?", choices: ["南蛮文化", "紅毛文化", "欧米文化", "ルネサンス", "天平文化", "元禄文化"], answer: "南蛮文化"},
    {id: "JSHEAC002", name: "input", grade: 2, question: "織田信長・豊臣秀吉の頃の文化は?", answer: "桃山文化"},
    {id: "JSHEEP001", name: "choice", grade: 2, question: "江戸時代に将軍の補佐をし、\n政治の実権を握った役職は?", choices: ["執権", "管領", "老中", "六波羅探題", "政所", "大老"], answer: "老中"},
    {id: "JSHEEP002", name: "input", grade: 2, question: "1669年にアイヌの人々をまとめ、\n蜂起の中心となった人物は?", answer: "シャクシャイン"},
    {id: "JSHEEP003", name: "input", grade: 2, question: "江戸時代の百姓のうち、\n自分の土地を持っているのは?", answer: "本百姓"},
    {id: "JSHEEP004", name: "input", grade: 2, question: "江戸時代の百姓のうち、\n自分の土地を持っていないのは?", answer: ["水呑百姓", "水呑み百姓", "水のみ百姓"], hideOther: true},
    {id: "JSHEEP005", name: "input", grade: 2, question: "江戸時代の百姓のうち、\n村の長であるのは?", answer: ["名主", "庄屋", "肝煎"]},
    {id: "JSHEEP006", name: "input", grade: 2, question: "江戸時代の百姓のうち、\n村政を行っていたのは?", answer: ["村役人", "村方三役", "地方三役"]},
    {id: "JSHEEP007", name: "input", grade: 2, question: "江戸時代の町人のうち、\n自分の土地を持っているのは?", answer: ["地主", "家持"]},
    {id: "JSHEEP008", name: "input", grade: 2, question: "江戸時代の町人のうち、\n自分の土地を持っていないのは?", answer: ["地借", "店借"]},
    {id: "JSHEEP009", name: "input", grade: 2, question: "江戸時代の町人のうち、\n町内の民政を行ったのは?", answer: "町役人"},
    {id: "JSHEEP010", name: "choice", grade: 2, question: "江戸幕府の第5代将軍は?", choices: ["徳川綱吉", "徳川家康", "徳川家光", "徳川慶喜", "徳川秀忠", "徳川光圀"], answer: "徳川綱吉"},
    {id: "JSHEEP011", name: "input", grade: 2, question: "元禄文化で、代表的な\n浮世草子の作者は?", answer: "井原西鶴"},
    {id: "JSHEEP012", name: "input", grade: 2, question: "元禄文化で、代表的な\n人形浄瑠璃の作者は?", answer: "近松門左衛門"},
    {id: "JSHEEP013", name: "input", grade: 2, question: "元禄文化で、代表的な俳諧師は?", answer: "松尾芭蕉"},
    {id: "JSHEEP014", name: "choice", grade: 2, question: "水戸黄門とも知られる、\n水戸藩の第2代藩主は?", choices: ["徳川光圀", "徳川家康", "徳川秀忠", "徳川家光", "徳川綱吉", "徳川慶喜"], answer: "徳川光圀"},
    {id: "JSHEEP015", name: "input", grade: 2, question: "点竄術を創始した和算家は?", answer: "関孝和"},
    {id: "JSHEEP016", name: "input", grade: 2, question: "貞享暦を編纂した人物は?", answer: "渋川春海"},
    {id: "JSHEEP017", name: "input", grade: 2, question: "農業全書を書いた人物は?", answer: "宮崎安貞"},
    {id: "JSHEEP018", name: "input", grade: 2, question: "国宝に指定された\n風神雷神図を描いた人物は?", answer: "俵屋宗達"},
    {id: "JSHEEE001", name: "choice", grade: 2, question: "鎖国によって、先に\n来航を禁止されたのは?", choices: ["スペイン船", "ポルトガル船"], answer: "スペイン船"},
    {id: "JSHEEE002", name: "choice", grade: 2, question: "鎖国によって、後に\n来航を禁止されたのは?", choices: ["ポルトガル船", "スペイン船"], answer: "ポルトガル船"},
    {id: "JSHEES001", name: "choice", grade: 2, question: "江戸幕府が大名の行動を制限する\n為に制定された法令は?", choices: ["武家諸法度", "禁中並公家諸法度", "御成敗式目"], answer: "武家諸法度"},
    {id: "JSHEES002", name: "choice", grade: 2, question: "江戸幕府が天皇や公家の行動を\n制限するために制定された法令は?", choices: ["禁中並公家諸法度", "武家諸法度", "御成敗式目"], answer: "禁中並公家諸法度"},
    {id: "JSHEES003", name: "choice", grade: 2, question: "江戸時代に、蝦夷地のアイヌ民族との\n交易を行ったのは?", choices: ["松前藩", "対馬藩", "対島藩", "薩摩藩", "幕府"], answer: "松前藩"},
    {id: "JSHEES004", name: "choice", grade: 2, question: "江戸時代に、琉球王国を支配したのは?", choices: ["薩摩藩", "松前藩", "対馬藩", "対島藩", "幕府"], answer: "薩摩藩"},
    {id: "JSHEES005", name: "choice", grade: 2, question: "キリシタンを発見するために\nキリスト像の絵等を使って行われたのは?", choices: ["絵踏", "踏絵", "島原・天草一揆", "宗門改"], answer: "絵踏"},
    {id: "JSHEES006", name: "choice", grade: 2, question: "御三家などの徳川家の\n親族である大名は?", choices: ["親藩", "譜代大名", "外様大名"], answer: "親藩"},
    {id: "JSHEES007", name: "choice", grade: 2, question: "関ヶ原の戦いの前に\n徳川家に従っていた大名は?", choices: ["親藩", "譜代大名", "外様大名"], answer: "譜代大名"},
    {id: "JSHEES008", name: "choice", grade: 2, question: "関ヶ原の戦いの後に\n徳川家に従った大名は?", choices: ["親藩", "譜代大名", "外様大名"], answer: "外様大名"},
    {id: "JSHEES009", name: "input", grade: 2, question: "村の掟を破った者等に対し、\n火事と葬式時以外で交際を断つ制裁は?", answer: "村八分"},
    {id: "JSHEES010", name: "input", grade: 2, question: "江戸時代に東北と大阪を結んだ航路は?", answer: ["西廻り航路", "西回り航路"], hideOther: true},
    {id: "JSHEES011", name: "input", grade: 2, question: "江戸時代に東北と江戸を結んだ航路は?", answer: ["東廻り航路", "東回り航路"], hideOther: true},
    {id: "JSHEES012", name: "input", grade: 2, question: "江戸時代に徳川綱吉によって発令された、\n生物の保護を目的とする法令は?", answer: ["生類憐みの令", "生類憐れみの令"]},
    {id: "JSHEES013", name: "input", grade: 2, question: "仏教宗派への所属により、キリシタンを\n発見することを目的とする制度は?", answer: ["宗門改", "宗門改め"], hideOther: true},
    {id: "JSHEEC001", name: "input", grade: 2, question: "主に綿花栽培等に使われ、\n金肥とも言われた魚肥は?", answer: ["干鰯", "ほしか"]},
    {id: "JSHEEC002", name: "input", grade: 2, question: "主に江戸時代での開墾を何と言う?", answer: "新田開発"},
    {id: "JSHEEC003", name: "choice", grade: 2, question: "江戸時代に「将軍のお膝元」と呼ばれたのは?", choices: ["江戸", "大阪", "京都", "奈良", "愛知", "福岡"], answer: "江戸"},
    {id: "JSHEEC004", name: "choice", grade: 2, question: "江戸時代に「天下の台所」と呼ばれたのは?", choices: ["大阪", "江戸", "京都", "奈良", "愛知", "福岡"], answer: "大阪"},
    {id: "JSHEEC005", name: "input", grade: 2, question: "井原西鶴が書いた小説の種類は?", answer: "浮世草子"},
    {id: "JSHEEC006", name: "input", grade: 2, question: "近松門左衛門が脚本を書いた人形劇の種類は?", answer: "人形浄瑠璃"},
    {id: "JSHEEC007", name: "input", grade: 2, question: "松尾芭蕉が詠んだ短詩の種類は?", answer: "俳諧"},
    {id: "JSHEEC008", name: "choice", grade: 2, question: "井原西鶴によって作られたのは?", choices: ["日本永代蔵", "曽根崎心中", "おくのほそ道", "風神雷神図屏風", "見返り美人図"], answer: "日本永代蔵"},
    {id: "JSHEEC009", name: "choice", grade: 2, question: "近松門左衛門によって作られたのは?", choices: ["日本永代蔵", "曽根崎心中", "おくのほそ道", "風神雷神図屏風", "見返り美人図"], answer: "曽根崎心中"},
    {id: "JSHEEC010", name: "choice", grade: 2, question: "松尾芭蕉によって作られたのは?", choices: ["日本永代蔵", "曽根崎心中", "おくのほそ道", "風神雷神図屏風", "見返り美人図"], answer: "おくのほそ道"},
    {id: "JSHEEC011", name: "input", grade: 2, question: "徳川光圀などによって作られた歴史書は?", answer: "大日本史"},
    {id: "JSHEEC012", name: "input", grade: 2, question: "宮崎安貞によって書かれたのは?", answer: "農業全書"},
    {id: "JSHEEC013", name: "input", grade: 2, question: "俵屋宗達によって書かれ、\n尾形光琳などに模写された作品は?", answer: ["風神雷神図", "風神雷神図屏風"], hideOther: true},
    {id: "JSHEEC014", name: "choice", grade: 2, question: "徳川綱吉の頃に上方を\n中心に栄えた文化は?", choices: ["元禄文化", "化政文化", "天平文化", "南蛮文化", "寛永文化"], answer: "元禄文化"},
    {id: "JSHEEB001", name: "choice", grade: 2, question: "江戸幕府によって、鎖国政策時に\nオランダとの貿易の為に\n作られたのは?", choices: ["出島", "唐人屋敷", "日本町"], answer: "出島"},
    {id: "JSHEEB002", name: "input", grade: 2, question: "江戸幕府によって、鎖国政策時に\n中国との貿易の為に\n作られたのは?", answer: "唐人屋敷"},
    {id: "JSHEEB003", name: "input", grade: 2, question: "江戸幕府の財政を支えた、\n新潟県の金山は?", answer: "佐渡金山"},
    {id: "JSHEEB004", name: "input", grade: 2, question: "世界遺産に登録された、\n島根県の銀山は?", answer: "石見銀山"},
    {id: "JSHEEB005", name: "choice", grade: 2, question: "五街道の内、江戸と京都を結び\n最も利用されたのは?", choices: ["東海道", "日光道中", "奥州道中", "中山道", "甲州街道"], answer: "東海道"},
    {id: "JSHEEB006", name: "input", grade: 2, question: "五街道の内、江戸と日光を結んだのは?", answer: ["日光道中", "日光街道"]},
    {id: "JSHEEB007", name: "input", grade: 2, question: "五街道の内、江戸と白河(福島)を結んだのは?", answer: ["奥州道中", "奥州街道"]},
    {id: "JSHEEB008", name: "choice", grade: 2, question: "五街道の内、江戸と滋賀を結ぶ内陸の道は?", choices: ["東海道", "日光道中", "奥州道中", "中山道", "甲州街道"], answer: "中山道"},
    {id: "JSHEEB009", name: "input", grade: 2, question: "五街道の内、江戸と長野の下諏訪を結び、\n中山道に合流する道は?", answer: ["甲州街道", "甲州道中"]},
    {id: "JSHEEB010", name: "input", grade: 2, question: "江戸の日本橋を起点とする、\n5つの街道をまとめて何と言う?", answer: "五街道"},
    {id: "JSHEEB011", name: "input", grade: 2, question: "江戸と大阪を結び、米や\n生活用品等を運んだ定期船は?", answer: "菱垣廻船"},
    {id: "JSHEEB012", name: "input", grade: 2, question: "江戸と大阪を結び、酒樽等を運んだ定期船は?", answer: "樽廻船"},
    {id: "JSHEEB013", name: "input", grade: 2, question: "江戸時代頃に京都や大阪、\nその周辺を指した言葉は?", answer: "上方"},
    {id: "JTMPPS001", name: "input", grade: 2, question: "寸法や直角度等を測るのに使う、\nL字型の金属板は?", answer: ["さしがね", "指矩"]},
    {id: "JTMPPS002", name: "input", grade: 2, question: "さしがねの長い方を何と言う?", answer: "長手"},
    {id: "JTMPPS003", name: "input", grade: 2, question: "さしがねの短い方を何と言う?", answer: "妻手"},
    {id: "JTMPPS004", name: "input", grade: 2, question: "寸法の基準となる直交する2面は?", answer: "基準面"},
    {id: "JTMPPS005", name: "input", grade: 2, question: "切り代・削り代を含まない\n寸法を何と言う?", answer: "仕上がり寸法"},
    {id: "JTMPPS006", name: "input", grade: 2, question: "切り代・削り代を含む\n寸法を何と言う?", answer: "材料取り寸法"},
    {id: "JTMPPS007", name: "input", grade: 2, question: "けがきで実際の寸法となる線は?", answer: "仕上がり寸法線"},
    {id: "JTMPPS008", name: "input", grade: 2, question: "けがきで切る位置の線は?", answer: "切断線"},
    {id: "JTMPPC001", name: "input", grade: 2, question: "両側に刃がある鋸は?", answer: ["両刃のこぎり", "両刃鋸"]},
    {id: "JTMPPC002", name: "input", grade: 2, question: "のこぎりの先端を何と言う?", answer: "先"},
    {id: "JTMPPC003", name: "input", grade: 2, question: "のこぎりの金属部分の\n根元を何と言う?", answer: "もと"},
    {id: "JTMPPC004", name: "input", grade: 2, question: "のこぎりの持ち手は何と言う?", answer: "柄"},
    {id: "JTMPPC005", name: "input", grade: 2, question: "のこぎりの持ち手の\n刃に近い方を何と言う?", answer: "柄がしら"},
    {id: "JTMPPC006", name: "input", grade: 2, question: "のこぎりの持ち手の\n刃から遠い方を何と言う?", answer: "柄じり"},
    {id: "JTMPPC007", name: "input", grade: 2, question: "のこぎりの金属部分を何と言う?", answer: "のこ身"},
    {id: "JTMPPC008", name: "input", grade: 2, question: "のこぎりの刃がある\n部分を何と言う?", answer: ["刃わたり", "刃渡り"], hideOther: true},
    {id: "JTMPPC009", name: "input", grade: 2, question: "両刃のこぎりで繊維方向に対し\n平行に切る為の刃は?", answer: ["縦びき刃", "縦挽き刃"], hideOther: true},
    {id: "JTMPPC010", name: "input", grade: 2, question: "両刃のこぎりで繊維方向に対し\n直角に切る為の刃は?", answer: ["横びき刃", "横挽き刃"], hideOther: true},
    {id: "JTMPPC011", name: "input", grade: 2, question: "両刃のこぎりで繊維方向に対し\n斜めに切る為の刃は?", answer: ["横びき刃", "横挽き刃"], hideOther: true},
    {id: "JTMPPC012", name: "choice", grade: 2, question: "刃の間隔が広いのは?", choices: ["縦びき刃", "横びき刃"], answer: "縦びき刃"},
    {id: "JTMPPC013", name: "choice", grade: 2, question: "刃の間隔が狭いのは?", choices: ["縦びき刃", "横びき刃"], answer: "横びき刃"},
    {id: "JTMPPC014", name: "input", grade: 2, question: "のこぎりで切るときに\nできる溝を何と言う?", answer: "ひき溝"},
    {id: "JTMPPC015", name: "input", grade: 2, question: "左右に振り分けられている\nのこ刃を何と言う?", answer: "あさり"},
    {id: "JTMPPC016", name: "choice", grade: 2, question: "あさりがあるのは?", choices: ["縦びき刃", "横びき刃"], answer: "横びき刃"},
    {id: "JTMPPC017", name: "choice", grade: 2, question: "切り始めはのこぎりを\n()ときに木材を切る", choices: ["押す", "引く"], answer: "押す"},
    {id: "JTMPPC018", name: "choice", grade: 2, question: "切る途中はのこぎりを\n()ときに木材を切る", choices: ["押す", "引く"], answer: "引く"},
    {id: "JTMPPC019", name: "input", grade: 2, question: "金属の棒材の切断に使うのは?", answer: "弓のこ"},
    {id: "JTMPPC020", name: "choice", grade: 2, question: "真鍮は銅と()の合金で、\n()が主に30~40%のもの", choices: ["鉄", "亜鉛", "鉛", "ビスマス", "ケイ素", "錫"], answer: "亜鉛"},
    {id: "JTMPPC021", name: "input", grade: 2, question: "弓のこのU字型の部分を何と言う?", answer: "フレーム"},
    {id: "JTMPPC022", name: "input", grade: 2, question: "金属の棒材を切断する\nときに何に固定する?", answer: "万力"},
    {id: "JTMPPC023", name: "choice", grade: 2, question: "弓のこを()ときに切断する", choices: ["押す", "引く"], answer: "押す"},
    {id: "JTMPPM001", name: "input", grade: 2, question: "木材の切削に使う伝統的な工具は?", answer: "かんな"},
    {id: "JTMPPM002", name: "input", grade: 2, question: "かんなのかしらがある\n側の面を何と言う?", answer: "うわば"},
    {id: "JTMPPM003", name: "input", grade: 2, question: "かんなの刃が出る\n側の面を何と言う?", answer: "したば"},
    {id: "JTMPPM004", name: "input", grade: 2, question: "かんなの横側の面を何と言う?", answer: "こば"},
    {id: "JTMPPM005", name: "input", grade: 2, question: "かんなを使うときに\n奥側になる面は?", answer: "台がしら"},
    {id: "JTMPPM006", name: "input", grade: 2, question: "かんなを使うときに\n前側になる面は?", answer: "台じり"},
    //{id: "O001", name: "draw", question: "ビャンビャン麺の漢字は?", answer: "𰻞𰻞麺"}
    //{id: "O002", name: "buttons", question: "1+1=?", answer: "2", buttons: this.numberButtonVer0}
  ];
  static categoryOfHistory = {
    P: {jp: "人物", en: "Person"},
    E: {jp: "出来事", en: "Event"},
    S: {jp: "制度", en: "System"},
    C: {jp: "文化", en: "Culture"},
    B: {jp: "建造物", en: "building"},
    H: {jp: "特徴", en: "Characteristic"},
    A: {jp: "因果", en: "CauseAndEffect"},
    I: {jp: "解釈", en: "Interpretation"}
  };
  static categoryOfGeography = {
    V: {jp: "概要", en: "Overview"}, 
    I: {jp: "産業", en: "Industry"}
  };
  /**
   * @typedef {Object<string, ObjValue>} TreeNode
   */
  /**
   * @typedef {Object} ObjValue
   * @property {string} jp
   * @property {string} en
   * @property {TreeNode} [sub]
   */
  /** @type {TreeNode} */
  static categories = {
    E: {jp: "小学", en: "ElementarySchool",
      sub: {}
    },
    J: {jp: "中学", en: "JuniorHighSchool",
      sub: {
        M: {jp: "数学", en: "Mathematics",
          sub: {
            A: {jp: "代数", en: "Algebra",
              sub: {
                N: {jp: "数と式", en: "NumbersAndFormulas",
                  sub: {
                    P: {jp: "正負の数", en: "PositiveAndNegativeNumbers"},
                    C: {jp: "文字式の計算", en: "CalculatingCharacterExpressions"},
                    E: {jp: "展開･因数分解", en: "Expantion/Factorization"},
                    S: {jp: "平方根", en: "SquareRoot"}
                  }
                },
                E: {jp: "方程式と不等式", en: "EquationsAndInequalities",
                  sub: {
                    L: {jp: "一次方程式", en: "LinearEquation"},
                    S: {jp: "連立方程式", en: "SimultaneousEquations"},
                    Q: {jp: "二次方程式", en: "QuadraticEquation"}
                  }
                },
                F: {jp: "関数", en: "Function",
                  sub: {
                    P: {jp: "比例･反比例", en: "(Inversely)Proportional"},
                    L: {jp: "一次関数", en: "LinearFunction"},
                    F: {jp: "2乗に比例する関数", en: "FunctionProportionalToTheSquare"}
                  }
                }
              }
            },
            G: {jp: "幾何", en: "Geometry",
              sub: {
                P: {jp: "平面図形", en: "PlaneFigure"},
                S: {jp: "空間図形", en: "SpaceFigure"},
                F: {jp: "図形の性質", en: "PropertiesOfFigure"},
                T: {jp: "三角形と四角形", en: "TrianglesAndQuadrilaterals"},
                I: {jp: "相似", en: "Similarity"},
                C: {jp: "円", en: "Circle"},
                Y: {jp: "三平方の定理", en: "Pythagoras'Theorem"}
              }
            },
            S: {jp: "数理統計", en: "MathematicalStatistics",
              sub: {
                D: {jp: "データの活用", en: "UtilizationOfData"},
                I: {jp: "四分位範囲と箱ひげ図", en: "InterquatileRangeAndBoxPlot"},
                P: {jp: "確率", en: "Probability"},
                S: {jp: "標本調査", en: "SampleSurvey"}
              }
            }
          }
        },
        J: {jp: "国語", en: "Japanese",
          sub: {
            S: {jp: "文章", en: "Sentence",
              sub: {
                L: {jp: "文学的文章", en: "LiteraryText"},
                E: {jp: "説明的文章", en: "ExplanatoryText"}
              }
            },
            P: {jp: "詩歌", en: "Poetry",
              sub: {
                P: {jp: "詩", en: "Poem"},
                H: {jp: "俳句", en: "Haiku"},
                T: {jp: "短歌", en: "Tanka"}
              }
            },
            L: {jp: "言語知識", en: "LanguageKnowledge",
              sub: {
                G: {jp: "文法", en: "Grammer",
                sub: {
                  S: {jp: "文の構造", en: "SentenceStructure",
                    sub: {
                      S: {jp: "成分", en: "SentenceComponents"},
                      C: {jp: "文節", en: "Clauses",
                        sub: {
                          C: {jp: "分類", en: "Classification"},
                          D: {jp: "文節分け", en: "Division"}
                        }
                      },
                      W: {jp: "単語", en: "Words",
                        sub: {
                          C: {jp: "分類", en: "Classification"},
                          D: {jp: "単語分け", en: "Division"}
                        }
                      },
                      R: {jp: "関係", en: "Relationship"},
                      I: {jp: "指示語", en: "InstructionWord"}
                    }
                  },
                  P: {jp: "品詞", en: "PartsOfSpeech",
                    sub: {
                      M: {jp: "主要", en: "Main"},
                      I: {jp: "自立語", en: "IndependentWords",
                        sub: {
                          I: {jp: "活用語", en: "InflectedWords",
                            sub: {
                              V: {jp: "動詞", en: "Verb"},
                              A: {jp: "形容詞", en: "Adjective"},
                              D: {jp: "形容動詞", en: "AdjectiveVerb"}
                            }
                          },
                          N: {jp: "非活用語", en: "NonInflectedWords"}
                        }
                      },
                      A: {jp: "付属語", en: "AuxiliaryWords",
                        sub: {
                          P: {jp: "助詞", en: "Particle"},
                          A: {jp: "助動詞", en: "AuxiliaryVerb"}
                        }
                      }
                    }
                  },
                  H: {jp: "敬語", en: "Honorifics"}
                }
              },
                K: {jp: "漢字", en: "Kanji"},
                P: {jp: "語句", en: "Phrase"},
                I: {jp: "成句", en: "IdiomaticPhrase"}
              }
            },
            C: {jp: "古典", en: "Classic",
              sub: {
                J: {jp: "古文", en: "ClassicalJapanese",
                  sub: {
                    H: {jp: "平家物語", en: "HeikeMonogatari"}
                  }
                },
                C: {jp: "漢文", en: "ClassicalChinese"}
              }
            }
          }
        },
        E: {jp: "英語", en: "English",
          sub: {
            G: {jp: "文法", en: "Grammar",
              sub: {
                S: {jp: "構文", en: "Syntax"},
                V: {jp: "動詞", en: "Verb"},
                N: {jp: "名詞", en: "Noun"},
                M: {jp: "修飾語", en: "Modifier"}
              }
            },
            V: {jp: "語彙", en: "Vocabulary",
              sub: {
                W: {jp: "単語", en: "Word"},
                P: {jp: "熟語", en: "Phrase"}
              }
            },
            R: {jp: "読解", en: "Reading"},
            W: {jp: "作文", en: "Writing"},
            L: {jp: "聴解", en: "Listening"},
            O: {jp: "其他", en: "Other"}
          }
        },
        C: {jp: "科学", en: "Science",
          sub: {
            C: {jp: "化学", en: "Chemistry",
              sub: {
                S: {jp: "物質", en: "Substances"},
                C: {jp: "化学変化", en: "ChemicalChanges"}
              }
            },
            B: {jp: "生物", en: "Biology",
              sub: {
                C: {jp: "分類", en: "Classification"},
                S: {jp: "構造", en: "Structure",
                  sub: {
                    P: {jp: "植物", en: "Plant"},
                    A: {jp: "動物", en: "Animal",
                      sub: {
                        D: {jp: "消化", en: "Digestion"},
                        C: {jp: "循環", en: "Circulation"},
                        R: {jp: "呼吸", en: "Respiration"},
                        E: {jp: "排出", en: "Excretion"},
                        S: {jp: "刺激と反応", en: "StimulusAndResponse"}
                      }
                    }
                  }
                },
                L: {jp: "細胞", en: "Cell"},
                G: {jp: "遺伝", en: "Genetics"}
              }
            },
            P: {jp: "物理", en: "Physics",
              sub: {
                L: {jp: "光", en: "Light"},
                S: {jp: "音", en: "Sound"},
                P: {jp: "力", en: "Power"},
                C: {jp: "回路", en: "Circuits",
                  sub: {
                    C: {jp: "電流･電圧･抵抗", en: "Current/Voltage/Resistance"},
                    S: {jp: "直列･並列回路", en: "Series/ParallelCircuits"}
                  }
                },
                M: {jp: "磁力", en: "MagneticForce"},
                R: {jp: "放射線", en: "Radiation"},
                E: {jp: "エネルギー", en: "Energy"}
              }
            },
            G: {jp: "地学", en: "Geology",
              sub: {
                E: {jp: "地球", en: "Earth"},
                W: {jp: "気象", en: "Weather"},
                S: {jp: "宇宙", en: "Space"}
              }
            }
          }
        },
        S: {jp: "社会", en: "Society",
          sub: {
            G: {jp: "地理", en: "Geography",
              sub: {
                J: {jp: "日本", en: "Japan",
                  sub: {
                    R: {jp: "地方", en: "Region",
                      sub: {
                        Y: {jp: "九州", en: "Kyusyu", sub: this.categoryOfGeography},
                        S: {jp: "中四国", en: "ChugokuAndShikoku", sub: this.categoryOfGeography},
                        K: {jp: "近畿", en: "Kinki", sub: this.categoryOfGeography},
                        C: {jp: "中部", en: "Chubu", sub: this.categoryOfGeography},
                        A: {jp: "関東", en: "Kanto", sub: this.categoryOfGeography},
                        T: {jp: "東北", en: "Tohoku", sub: this.categoryOfGeography},
                        H: {jp: "北海道", en: "Hokkaido", sub: this.categoryOfGeography}
                      }
                    }
                  }
                }
              }
            },
            H: {jp: "歴史", en: "History",
              sub: {
                P: {jp: "原始", en: "Prehistory",
                  sub: {
                    P: {jp: "旧石器時代", en: "PaleolithicAge", sub: this.categoryOfHistory},
                    J: {jp: "縄文時代", en: "JomonPeriod", sub: this.categoryOfHistory},
                    Y: {jp: "弥生時代", en: "YayoiPeriod", sub: this.categoryOfHistory}
                  }
                },
                A: {jp: "古代", en: "Ancient",
                  sub: {
                    K: {jp: "古墳時代", en: "KofunPeriod", sub: this.categoryOfHistory},
                    A: {jp: "飛鳥時代", en: "AsukaPeriod", sub: this.categoryOfHistory},
                    N: {jp: "奈良時代", en: "NaraPeriod", sub: this.categoryOfHistory},
                    H: {jp: "平安時代", en: "HeianPeriod", sub: this.categoryOfHistory}
                  }
                },
                D: {jp: "中世", en: "MiddleAges",
                  sub: {
                    K: {jp: "鎌倉時代", en: "KamakuraPeriod", sub: this.categoryOfHistory},
                    M: {jp: "室町時代", en: "MuromachiPeriod", sub: this.categoryOfHistory},
                    S: {jp: "戦国時代", en: "SengokuPeriod", sub: this.categoryOfHistory}
                  }
                },
                E: {jp: "近世", en: "EarlyModernPeriod",
                  sub: {
                    A: {jp: "安土桃山時代", en: "Azuchi-MomoyamaPeriod", sub: this.categoryOfHistory},
                    E: {jp: "江戸時代", en: "EdoPeriod", sub: this.categoryOfHistory}
                  }
                },
                M: {jp: "近代", en: "ModernPeriod",
                  sub: {
                    M: {jp: "明治時代", en: "MeijiPeriod", sub: this.categoryOfHistory},
                    T: {jp: "大正時代", en: "TaishoPeriod", sub: this.categoryOfHistory},
                    S: {jp: "昭和前期", en: "EarlyShowaPeriod", sub: this.categoryOfHistory}
                  }
                },
                C: {jp: "現代", en: "Contemporary",
                  sub: {
                    S: {jp: "昭和後期", en: "LateShowaPeriod", sub: this.categoryOfHistory},
                    H: {jp: "平成時代", en: "HeiseiPeriod", sub: this.categoryOfHistory},
                    R: {jp: "令和時代", en: "ReiwaPeriod", sub: this.categoryOfHistory}
                  }
                },
                O: {jp: "その他", en: "others",
                  sub: {
                    P: {jp: "時代区分", en: "PeriodClassification"},
                    A: {jp: "古代文明", en: "AncientCivilization"}
                  }
                }
              }
            },
            C: {jp: "公民", en: "Civics",
              sub: {}
            }
          }
        },
        T: {jp: "技術", en: "Technology",
          sub: {
            M: {jp: "材料加工", en: "MaterialProcessing",
              sub: {
                M: {jp: "仕組み", en: "Mechanism"},
                P: {jp: "問題解決", en: "ProblemSolving",
                  sub: {
                    D: {jp: "設計", en: "Design"},
                    P: {jp: "製作", en: "Production",
                      sub: {
                        S: {jp: "けがき", en: "Scribing"},
                        C: {jp: "切断", en: "Cutting"},
                        M: {jp: "切削", en: "Machining"},
                        D: {jp: "穴あけ", en: "Drilling"},
                        J: {jp: "接合", en: "Joining"},
                        F: {jp: "仕上げ", en: "Finishing"}
                      }
                    },
                  }
                },
                D: {jp: "発展", en: "Development"}
              }
            },
            B: {jp: "生物育成", en: "BiologicalCultivation"},
            E: {jp: "エネルギー変換", en: "EnergyConversion"},
            I: {jp: "情報", en: "Information"},
          }
        },
        H: {jp: "家庭科", en: "HomeEconomics",
          sub: {}
        },
        O: {jp: "その他", en: "Others",
          sub: {}
        }
      }
    },
    H: {jp: "高校", en: "HighSchool",
      sub: {
        M: {jp: "数学", en: "Mathematics",
          sub: {
            I: {jp: "数学I", en: "I"},
            A: {jp: "数学A", en: "A"},
            J: {jp: "数学II", en: "II"},
            B: {jp: "数学B", en: "B"},
            K: {jp: "数学III", en: "III"},
            C: {jp: "数学C", en: "C"},
          }
        }
      }
    },
    O: {jp: "その他", en: "Others"}
  };
  constructor() {
    this.index = 0;
    this.event = undefined;
    this.branch = {
      time: this.manageTime.bind(this),
      btn: this.updateButton.bind(this),
      switchOutset: this.updateOutset.bind(this),
      move: this.updateMove.bind(this),
      characterMotion: this.characterMotion.bind(this),
      stableInput: this.stableInput.bind(this),
      createCracker: this.createCracker.bind(this),
      cracker: this.cracker.bind(this),
      drawCanvas: this.drawCanvas.bind(this)
    };
    this.isMoving = false;
    this.choiceColors = [
      ["#FF6666"],
      ["#FF6666", "#6666FF"],
      ["#FF6666", "#6666FF", "#FFFF66"],
      ["#FF6666", "#FFFF66", "#66FF66", "#6666FF"],
      ["#FF6666", "#FFFF66", "#66FF66", "#66FFFF", "#6666FF"],
      ["#FF6666", "#FFFF66", "#66FF66", "#66FFFF", "#6666FF", "#FF66FF"]
    ];
    this.problemStatement = {};
    this.results = {turn: 1, correct: 0, inCorrect: 0, element: {update: {}, draw: {turn: {name: "text", text: displayNames.turn + ": 1", x: 15, y: 55}, correct: {name: "text", text: displayNames.correct + ": 0", x: 15, y: 75}, rate: {name: "text", text: displayNames.correctRate + ": NaN%", x: 100, y: 75}}}};
    mainArray.push(this.results.element);
    if (displayLog) {
      this.log = {update: {}, draw: {rect: {name: "rect", fillColor: "#ddd", x: 750, y: 5, width: 200, height: 90}, text: {name: "text", text: "ろぐだよ", setTop: true, x: 755, y: 20}}};
      mainArray.push(this.log);
    }
    const conditions = Array.isArray(problemIdCenter) ? problemIdCenter : [problemIdCenter];
    this.problems = conditions.flatMap(condition => this.constructor.allProblems.filter(problem => problem.id.startsWith(condition)));
    console.log(this.problems);
    console.log("全体問題数: ", this.constructor.allProblems.length);
    console.log("問題数: ", this.problems.length);
    this.currentProblem = {};
    this.subCanvas = document.createElement("canvas");
    this.subCtx = this.subCanvas.getContext("2d");
    this.subCanvas.width = 360;
    this.subCanvas.height = 150;
    this.subCtx.clearRect(0, 0, this.subCanvas.width, this.subCanvas.height);
  }
  update() {
    //console.log(this.isMoving);
    for (this.index = 0; this.index < mainArray.length; this.index++) {
      this.event = mainArray[this.index];
      if (this.event.update?.name === undefined || this.event.update?.name === null) {
        if (Object.keys(this.event).length === 0 || Object.keys(this.event.update).length === 0 && Object.keys(this.event.draw).length === 0) {
          mainArray.splice(this.index, 1);
          this.index--;
          continue;
        }
      } else if (this.event.update.name === "main") {
        if (mainOperations.progress) {
          mainOperations.progress = false;
          if (gameMode.situation === "choosedCmd" && (gameMode.cmdType === displayNames.magic || gameMode.cmdType === displayNames.item)) {
            this.displayMenu();
          } else if (gameMode.situation === "choosedCmd" && (gameMode.cmdType === displayNames.attack || gameMode.cmdType === displayNames.defense) || gameMode.situation === "chooseMenu" && (gameMode.cmdType === displayNames.magic || gameMode.cmdType === displayNames.item)) {
            this.generateProblem();
          } else if (gameMode.situation === "question") {
            this.processAnswer();
          } else if (gameMode.situation === "return") {
            this.returnFirst();
          }
        }
      } else if (this.branch[this.event.update.name]) {
        this.branch[this.event.update.name](this.event);
      } else if (this.event.update.name == "changeValue") {
        this.event.update.collections[this.event.update.key] = this.event.update.value;
        if (!this.event.update.isContinue) {
          mainArray.splice(this.index, 1);
          this.index--;
        }
      } else if (this.event.update.name == "spliceToArray") {
        this.event.update.collections.splice(this.event.update.startIndex, (this.event.update.deletes ?? 0), ...this.event.update.values);
        mainArray.splice(this.index, 1);
        this.index--;
      } else if (this.event.update.name == "dispelClick") {
        this.isMoving = false;
        mainArray.splice(this.index, 1);
        this.index--;
      } else if (this.event.update.name == "deleteElement") {
        this.event.update.element.remove();
        mainArray.splice(this.index, 1);
        this.index--;
      } else if (this.event.update.name == "deleteAll") {
        this.deletes(this.event.update.element);
        mainArray.splice(this.index, 1);
        this.index--;
      } else if (this.event.update.name == "setProgress") {
        if (!this.isMoving) {
          mainOperations.progress = true;
          this.isMoving = true;
        }
        mainArray.splice(this.index, 1);
        this.index--;
      } else if (this.event.update.name == "original") {//not recomended
        this.event.update.func();
        mainArray.splice(this.index, 1);
        this.index--;
      }
    }
    for (let i = 0; i < newUpdate.length; i++) {
      if (newUpdate[i][0] <= 0) {
        mainArray.push(newUpdate[i][1]);
        newUpdate.splice(i, 1);
        i--;
      } else {
        newUpdate[i][0]--;
      }
    }
  }
  /**
   * 
   * @param {*} element 
   * @param {string[]} [protects]
   */
  deletes(element, protects=[]) {
    if (element instanceof HTMLElement) {
      element.remove();
    } else if (Array.isArray(element)) {
      for (let i = 0; i < element.length; i++) {
        this.deletes(element[i]);
      }
      element.length = 0;
    } else if (element != null && typeof element === "object") {
      for (const key in element) {
        if (Object.prototype.hasOwnProperty.call(element, key)) {
          if (protects.includes(key)) {
            this.deletes(element[key]);
          }
          delete element[key];
        }
      }
    }
  }
  recursiveOutset(any, box) {
    if ("y" in any) {
      box.collections.push(any);
      box.key.push("y");
    } else if ("locations" in any) {
      any.locations.forEach(x => {
        box.collections.push(x);
        box.key.push(1);
      });
    } else if ("draw" in any) {
      this.recursiveOutset(any.draw, box);
    } else if (Array.isArray(any)) {
      any.forEach(x => this.recursiveOutset(x, box));
    } else {
      for (const key in any) {
        if (any.hasOwnProperty(key)) {
          this.recursiveOutset(any[key], box);
        }
      }
    }
  }
  displayMenu() {
    let menu = Creates.newMenu(400, -80, 214, 200, (gameMode.cmdType == displayNames.magic ? cat.ability.magics : cat.ability.items), 60, {isPush: false});
    console.log(menu[1].draw.text.text);
    menu = menu.map(x => ({update: {...x.update, shift: 1, newEvent: [{update: {name: "changeValue", collections: gameMode, key: "menuType", value: (x.draw.text?.text ?? "none")}, draw: {}}, {update: {name: "setProgress"}, draw: {}}]}, draw: {name: "clip", rect: [0, 75, 1000, 450], draw: x.draw}}));
    for (let i = 0; i < menu.length; i++) {
      mainArray.push(menu[i]);
    }
    this.problemStatement.menu = menu;
    const arr = [16];//20, 32, -2
    const moveObj = {
      update: {
        name: "move",
        changes: [
          {collections: [arr], key: [0], movement: -1, acceleration: 0},
          {collections: [], key: [], movement: 40, acceleration: -3}
        ],
        conditions: [{collections: arr, key: 0, op: ">", value: 0}]
      },
      draw: {}
    };
    for (let i = 0; i < menu.length; i++) {
      let element = menu[i].draw.draw;
      let keys;
      if ("name" in element) {
        element = [element];
        keys = [0];
      } else {
        keys = Object.keys(element);
      }
      for (let j = 0; j < keys.length; j++) {
        if (["border", "text", "rect"].includes(element[keys[j]].name)) {
          moveObj.update.changes[1].collections.push(element[keys[j]]);
          moveObj.update.changes[1].key.push("y");
        } else if (element[keys[j]].name === "poly") {
          element[keys[j]].locations.forEach(function(item) {
            moveObj.update.changes[1].collections.push(item);
          });
          moveObj.update.changes[1].key.push(...Array(element[keys[j]].locations.length).fill(1));
        }
      }
    }
    mainArray.push(moveObj);
    gameMode.situation = "chooseMenu";
    newUpdate.push([17, {update: {name: "dispelClick"}, draw: {}}]);
  }
  generateProblem() {
    this.currentProblem = this.getProblem();
    this.problemTypes = this.currentProblem.name.split(" ");
    if (this.problemTypes.includes("generate")) {
      const generate = GenerateProblem.generate(this.currentProblem.id.slice(0, -3), this.currentProblem.generates);
      this.currentProblem = {...generate, ...this.currentProblem};
    }
    console.log(this.currentProblem);
    console.log("id: ", this.currentProblem.id);
    let delay = gameMode.cmdType === displayNames.attack ? 3 : 0;
    if (gameMode.cmdType === displayNames.magic || gameMode.cmdType === displayNames.item) {
      const arr = [20];
      const move = {update: {name: "move", changes: [{collections: [], key: [], movement: -30, acceleration: 1}, {collections: [arr], key: [0], movement: -1}], conditions: [{collections: arr, key: 0, op: "!=", value: 0}], isDelete: true, update: {update: {name: "deleteAll", element: this.problemStatement.menu.map(element => element.update), protects: "collections"}}}, draw: this.problemStatement.menu.map(element => element.draw)};
      this.problemStatement.menu.forEach(element => {
        move.update.changes[0].collections.push(element.draw.rect);
        move.update.changes[0].key.push(3);
      });
      mainArray.push(move);
      delay += 20;
    }
    const arr = [16];
    const border = {name: "border", x: 320, y: 500, width: 360, height: 180};
    const moveObj = {update: {name: "move", changes: [{collections: [border], key: ["y", "y"], movement: -76, acceleration: 6}, {collections: [arr], key: [0], movement: -1}], conditions: [{collections: arr, key: 0, op: "!=", value: 0}], maintain: true}, draw: {name: "clip", rect: [[0, 75, 1000, 450], [0, 0, 400, 525], [614, 0, 386, 525]], draw: {border}}};
    let text;
    if (typeof this.currentProblem.question === "string") {
      text = {name: "text", text: this.currentProblem.question, x: 500, y: 590, textAlign: "center"};
      moveObj.update.changes[0].collections.push(text);
    } else if (this.currentProblem.question instanceof HTMLImageElement) {
      text = {name: "img", img: this.currentProblem.question, x: 500, y: 590, width: 200, center: true};
      moveObj.update.changes[0].collections.push(text);
    } else if (Array.isArray(this.currentProblem.question)) {
      if (2 <= this.currentProblem.question.length && typeof this.currentProblem.question[0] === "string" && this.currentProblem.question[1] instanceof HTMLImageElement) {
        const img = this.currentProblem.question[1];
        const problemText = this.currentProblem.question[0];
        const height = 170 - 20 * problemText.split("\n").length;
        const width = 360;
        let imgWidth = 200;
        let imgHeight = imgWidth * img.naturalHeight / img.naturalWidth;
        if (height < imgHeight) {
          const magnification = height / imgHeight;
          imgWidth *= magnification;
          imgHeight *= magnification;
        }
        text = {text: {name: "text", text: problemText, setTop: true, x: 500, y: 520, textAlign: "center"}, img: {name: "img", img, x: 500, y: 600 + 10 * problemText.split("\n").length, width: imgWidth, center: true, sprite: (this.currentProblem.sprite ? this.currentProblem.sprite : false)}};
        moveObj.update.changes[0].collections.push(text.text, text.img);
        moveObj.update.changes[0].key.push("y");
      }
    }
    moveObj.draw.draw.text = text;
    let id;
    if (["jp", "en"].includes(idType)) {
      id = {name: "text", text: displayNames.type + ": " + this.getProblemType(this.currentProblem.id, idType), x: 670, y: 670, textAlign: "right", font: (idType === "jp" ? "normal 14px " + fontType : "normal 10px " + fontType), setBottom: true};
    } else if (idType === "id") {
      id = {name: "text", text: displayNames.id + ": " + this.currentProblem.id, x: 670, y: 670, textAlign: "right"};
    }
    this.problemStatement.border = border;
    this.problemStatement.text = text;
    if (id) {
      this.problemStatement.id = id;
      moveObj.update.changes[0].collections.push(id);
      moveObj.update.changes[0].key.push("y");
      moveObj.draw.draw.id = id;
    }
    console.log(moveObj);
    newUpdate.push([delay, moveObj]);
    if (this.problemTypes.includes("choice")) {
      const choices = RandomArray(this.currentProblem.choices);
      const choiceWidth = this.currentProblem.width ?? 150;
      const edgeSpace = this.currentProblem.edge ?? 0;
      const space = (1000 - choiceWidth * choices.length - edgeSpace * 2) / (choices.length + 1);
      const colors = this.choiceColors[choices.length - 1];
      const buttons = [];
      for (let i = 0; i < choices.length; i++) {
        buttons.push(Creates.newButton("switchOutset", choices[i], edgeSpace + choiceWidth * i + space * (i + 1), 600, choiceWidth, this.currentProblem.height ?? 100, {aroundColor: colors[i], font: "normal 17px " + fontType, aroundWidth: 7, type: "any", newEvent: {update: {name: "setProgress"}, draw: {}}}));
      }
      this.problemStatement.buttons = buttons;
      newUpdate.push([delay, {update: {name: "move", changes: [{collections: buttons.flatMap(x => [[x.draw.rect], [x.draw.text], Array.from({length: 6}, (_, i) => x.draw.upper.locations[i]), Array.from({length: 6}, (_, i) => x.draw.lower.locations[i])].flat()), key: Array(buttons.length).fill(["y", "y"].concat(Array(12).fill(1))).flat(), movement: -55, acceleration: 5}], conditions: [{collections: arr, key: 0, op: "!=", value: 0}]}, draw: {}}]);
    } else if (this.problemTypes.includes("input")) {
      const input = document.createElement("input");
      input.type = "text";
      input.style.width = "214px";
      input.style.left = "400px";
      input.style.top = "510px";
      const button = Creates.newButton("switchOutset", "決定", 440, 565, 140, 45, {aroundColor: "gray", aroundWidth: 5, font: "normal 20px " + fontType, type: "any", newEvent: {update: {name: "setProgress"}, draw: {}}});
      this.problemStatement.button = button;
      this.problemStatement.input = input;
      newUpdate.push([delay + 3, {update: {name: "original", func: () => {wrapper.appendChild(input);input.focus();}}, draw: {}}]);
      const array = [delay + 3, {update: {name: "move", changes: [{collections: [input.style], key: ["top"], movement: -40, acceleration: 5, accessories: 2}, {collections: [], key: [], movement: -28, acceleration: 3}], conditions: [{collections: arr, key: 0, op: "!=", value: 0}]}, draw: {}}];
      this.recursiveOutset(button, array[1].update.changes[1]);
      newUpdate.push(array);
      //mainArray.push({update: {name: "stableInput", input, x: 0, y: 600}, draw: {}});
    } else if (this.problemTypes.includes("draw")) {
      this.subCtx.strokeStyle = "red";
      this.subCtx.strokeRect(10, 10, 50, 100);
      const drawCanvas = {update: {name: "drawCanvas", x: 0, y: 0, width: this.subCanvas.width, height: this.subCanvas.height}, draw: {canvas: {name: "img", img: this.subCanvas, x: 320, y: 450, width: 360, height: 150}, border: {name: "border", x: 320, y: 450, width: this.subCanvas.width, height: this.subCanvas.height}}};
      newUpdate.push([delay + 3, drawCanvas]);
      newUpdate.push([delay + 3, {update: {name: "move", changes: [{collections: [drawCanvas.draw.canvas, drawCanvas.draw.border], key: ["y", "y"], movement: -40, acceleration: 5}], conditions: [{collections: arr, key: 0, op: "!=", value: 0}]}, draw: {}}]);
    } else if (this.problemTypes.includes("buttons")) {
      let buttons = [];
      const array = [...this.currentProblem.buttons, {text: "del", color: "white"}, {text: "↲", color: "gray"}];
      for (let i = 0; i < array.length; i++) {
        buttons.push(Creates.newButton("switchOutset", array[i].text, i * 80 + 30, 400, 50, 50, {aroundColor: array[i].color, aroundWidth: 5}));
      }
    }
    newUpdate.push([delay + 20, {update: {name: "dispelClick"}, draw: {}}]);
    gameMode.situation = "question";
  }
  getProblem() {
    return this.problems[Math.floor(Math.random() * this.problems.length)];
  }
  getProblemType(id, type) {
    let result = "";
    let category = this.constructor.categories;
    let i = id[0];
    let length = 0;
    while (id && category?.[i]?.[type]) {
      length++;
      if (length % 5 == 0) result += "\n";
      result += (result.length ? "→" : "") + category[i][type];
      category = category[i]?.sub;
      id = id.slice(1);
      i = id[0] ?? null;
    }
    return result;
  }
  processAnswer() {
    let delay = 0;
    const type = (this.problemTypes.includes("choice") ? "choice" : this.problemTypes.includes("input") ? "input" : "none");
    let userAns;
    if (type === "choice") {
      let index;
      for (let i = 0; i < this.currentProblem.choices.length; i++) {
        if (this.problemStatement.buttons[i].update.isPushed) {
          index = i;
          break;
        }
      }
      this.problemStatement.buttons[index].update.isPushed = false;
      this.problemStatement.buttons.forEach(element => element.update.isDestruction = true);
      userAns = this.problemStatement.buttons[index].draw.text.text;
    } else if (type === "input") {
      this.problemStatement.button.isReject = true;
      userAns = this.problemStatement.input.value;
    }
    let string = true;
    let answers = [];
    if (Array.isArray(this.currentProblem.answer)) {
      if (this.currentProblem.answer.some((ans) => Array.isArray(ans))) {
        answers = [""];
        for (let i = 0; i < this.currentProblem.answer.length; i++) {
          if (Array.isArray(this.currentProblem.answer[i])) {
            answers = answers.map(arr => (this.currentProblem.answer[i].map(ans => arr.concat(ans)))).flat();
          } else {
            answers = answers.map(arr => arr.concat(this.currentProblem.answer[i]));
          }
          console.log(answers);
        }
      } else {
        answers = this.currentProblem.answer;
      }
    } else {
      answers = [this.currentProblem.answer];
    }
    if (answers.includes(userAns)) {
      string = "正解!";
      if (gameMode.cmdType === displayNames.attack) {
        cat.ability.att.physical.magnifications.push([0, 1.5]);
      } else if (gameMode.cmdType === displayNames.magic) {
        cat.ability.att.magical.magnifications.push([0, 1.5]);
      } else if (gameMode.cmdType === displayNames.defense) {
        cat.ability.def.physical.magnifications.push([0, 1.5]);
      }
      this.results.correct++;
    } else {
      string = "不正解(´・ω・｀)\n正解: " + (answers[0] + (answers.length === 1 || this.currentProblem.hideOther ? "" : "(" + answers.slice(1).join(", ") + ")"));
      if (gameMode.cmdType === displayNames.attack) {
        cat.ability.att.physical.magnifications.push([0, 0.5]);
      } else if (gameMode.cmdType === displayNames.magic) {
        cat.ability.att.magical.magnifications.push([0, 0.5]);
      } else if (gameMode.cmdType === displayNames.defense) {
        cat.ability.def.physical.magnifications.push([0, 0.5]);
      }
      this.results.inCorrect++;
    }
    this.results.element.draw.correct.text = displayNames.correct + ": " + this.results.correct;
    this.results.element.draw.rate.text = displayNames.correctRate + ": " + ((this.results.correct + this.results.inCorrect) != 0 ? Math.floor(this.results.correct / (this.results.correct + this.results.inCorrect) * 100) : "NaN") + "%";
    let button = Creates.newButton("switchOutset", string + "\n次へ", 320, 200, 360, 80, {aroundColor: "#EEEEEE", font: "normal 17px " + fontType, aroundWidth: 3, isPush: false, type: "any", newEvent: {update: {name: "setProgress"}, draw: {}}});
    button = {update: {...button.update, shift: 1}, draw: {name: "clip", rect: [0, 280, 1000, 245], draw: button.draw}};
    this.problemStatement.scoring = button.draw;
    mainArray.push(button);
    const arr = [12];
    delay += arr[0];
    if (type === "choice") {
      mainArray.push({update: {
        name: "move",
        changes: [{
          collections: [[button.draw.draw.rect], [button.draw.draw.text], Array.from({length: 6}, (_, i) => button.draw.draw.lower.locations[i]), Array.from({length: 6}, (_, i) => button.draw.draw.upper.locations[i])].flat(),
          key: ["y", "y"].concat(Array(12).fill(1)),
          movement: 27,
          acceleration: -3
          }, {collections: [arr], key: [0], movement: -1, acceleration: 0}],
        conditions: [{collections: arr, key: 0, op: "!=", value: 0}]}, draw: {}});
    } else if (type === "input") {
      const moveEvent = {update: {name: "move", changes: [{collections: [], key: [], movement: 27, acceleration: -3}, {collections: [arr], key: [0], movement: -1, acceleration: 0}], conditions: [{collections: arr, key: 0, op: "!=", value: 0}]}, draw: {}};
      this.recursiveOutset(button, moveEvent.update.changes[0]);
      mainArray.push(moveEvent);
    }
    const motionDelay = 27;
    if (gameMode.cmdType === displayNames.attack) {
      newUpdate.push([delay, {update: {name: "characterMotion", type: "attack", target: crabElems, returns: cat.attack(crab), sign: -1, log: ["猫からかにへの攻撃!\n", "ダメージ!"], turns: motionDelay}, draw: {}}]);
      delay += motionDelay + 3;
    } else if (gameMode.cmdType === displayNames.magic) {
      if (Character.magics[gameMode.menuType].name === "attack") {
        newUpdate.push([delay, {update: {name: "characterMotion", type: "magic", id: gameMode.menuType, origin: catElems, target: crabElems, returns: cat.magic(gameMode.menuType, crab), sign: -1, turns: motionDelay}, draw: {}}]);
        delay += motionDelay + 3;
      } else if (Character.magics[gameMode.menuType].name === "heal") {
        newUpdate.push([delay, {update: {name: "characterMotion", type: "magic", id: gameMode.menuType, origin: catElems, target: catElems, returns: cat.magic(gameMode.menuType, cat), sign: -1, turns: motionDelay}, draw: {}}]);
        delay += motionDelay + 3;
      }
    } else if (gameMode.cmdType === displayNames.item) {
      newUpdate.push([delay, {update: {name: "characterMotion", type: "item", origin: catElems, target: catElems, returns: cat.item(gameMode.menuType, cat), sign: -1, turns: motionDelay}, draw: {}}]);
      delay += motionDelay + 3;
    }
    if (crab.ability.hp.now) {
      newUpdate.push([delay, {update: {name: "characterMotion", type: "attack", target: catElems, returns: crab.attack(cat), log: ["かにから猫への攻撃\n", "ダメージ(´・ω・｀)"], turns: motionDelay}, draw: {}}]);
      delay += motionDelay + 3;
    }
    newUpdate.push([delay + 1, {update: {name: "dispelClick"}, draw: {}}]);
    gameMode.situation = "return";
  }
  returnFirst() {
    for (let i = 0; i < characters.length; i++) {
      characters[i].endTurn();
    }
    const element = {update: {name: "move", changes: [{collections: [], key: [], movement: 0, acceleration: 3}, {collections: [], key: [], movement: -10}], conditions: [{collections: this.problemStatement.border, key: "y", op: "<", value: 525}]}, draw: {}};
    this.recursiveOutset([this.problemStatement.border, this.problemStatement.text, this.problemStatement.scoring], element.update.changes[0]);
    this.recursiveOutset(this.cmd, element.update.changes[1]);
    if (this.problemStatement.id) this.recursiveOutset(this.problemStatement.id, element.update.changes[0]);
    if (this.problemTypes.includes("choice")) {
      this.recursiveOutset(this.problemStatement.buttons, element.update.changes[0]);
    } else if (this.problemTypes.includes("input")) {
      this.recursiveOutset(this.problemStatement.button, element.update.changes[0]);
      element.update.changes.push({collections: [this.problemStatement.input.style], key: ["top"], movement: 0, acceleration: 3, accessories: 2});
      newUpdate.push([27, {update: {name: "deleteElement", element: this.problemStatement.input}, draw: {}}]);
    }
    mainArray.push(element);
    if (!crab.ability.hp.now) {
      const arr = [16];
      const clearText = {update: {name: "move", changes: [{collections: [arr], key: [0], movement: -1}], conditions: [{collections: arr, key: 0, op: "!=", value: 0}], maintain: true}, draw: {name: "text", font: "30px solid " + fontType, textAlign: "center", text: "Game Clear!", x: 500, y: -30}};
      clearText.update.changes.push({collections: [clearText.draw], key: ["y"], movement: 40, acceleration: -3});
      newUpdate.push([15, clearText]);
      newUpdate.push([22, {update: {name: "createCracker", maxPieces: 70, minPieces: 40, maxArc: Math.PI * 9 / 5, minArc: Math.PI * 3 / 2, maxSpeed: 45, minSpeed: 10, gravity: 1.5, maxLife: 120, minLife: 45, x: 0, y: 0, maxSize: 9, minSize: 2}, draw: {}}]);
      newUpdate.push([22, {update: {name: "createCracker", maxPieces: 70, minPieces: 40, maxArc: Math.PI * 3 / 2, minArc: Math.PI * 6 / 5, maxSpeed: 45, minSpeed: 10, gravity: 1.5, maxLife: 120, minLife: 45, x: 1000, y: 0, maxSize: 9, minSize: 2}, draw: {}}]);
      newUpdate.push([22, {update: {name: "createCracker", maxPieces: 70, minPieces: 40, maxArc: Math.PI * 9 / 5, minArc: Math.PI * 3 / 2, maxSpeed: 45, minSpeed: 10, gravity: 1.5, maxLife: 120, minLife: 45, x: 0, y: 525, maxSize: 9, minSize: 2}, draw: {}}]);
      newUpdate.push([22, {update: {name: "createCracker", maxPieces: 70, minPieces: 40, maxArc: Math.PI * 3 / 2, minArc: Math.PI * 6 / 5, maxSpeed: 45, minSpeed: 10, gravity: 1.5, maxLife: 120, minLife: 45, x: 1000, y: 525, maxSize: 9, minSize: 2}, draw: {}}]);
    } else if (!cat.ability.hp.now) {
      const arr = [16];
      const clearText = {update: {name: "move", changes: [{collections: [arr], key: [0], movement: -1}], conditions: [{collections: arr, key: 0, op: "!=", value: 0}], maintain: true}, draw: {name: "text", font: "30px solid " + fontType, textAlign: "center", text: "Game Over...", x: 500, y: -30}};
      clearText.update.changes.push({collections: [clearText.draw], key: ["y"], movement: 40, acceleration: -3});
      newUpdate.push([15, clearText]);
    } else {
      const attackButton = Creates.newButton("switchOutset", displayNames.attack, 400, -212, 214, 45, { aroundColor: "red", aroundWidth: 7, type: "cmd" });
      const magicButton = Creates.newButton("switchOutset", displayNames.magic, 400, -157, 214, 45, { aroundColor: "blue", aroundWidth: 7, type: "cmd" });
      const itemButton = Creates.newButton("switchOutset", displayNames.item, 400, -102, 214, 45, { aroundColor: "green", aroundWidth: 7, type: "cmd" });
      const defenseButton = Creates.newButton("switchOutset", displayNames.defense, 400, -47, 214, 45, { aroundColor: "yellow", aroundWidth: 7, type: "cmd" });
      const arr = [16];
      const buttons = {update: {name: "move", changes: [{collections: [], key: [], movement: 45, acceleration: -3}, {collections: [arr], key: [0], movement: -1}], conditions: [{collections: arr, key: 0, op: "!=", value: 0}]}, draw: {}};
      this.recursiveOutset([attackButton, magicButton, itemButton, defenseButton], buttons.update.changes[0]);
      newUpdate.push([10, buttons]);
      newUpdate.push([27, {update: {name: "dispelClick"}, draw: {}}]);
      this.results.turn++;
      newUpdate.push([27, {update: {name: "changeValue", collections: this.results.element.draw.turn, key: "text", value: displayNames.turn + ": " + this.results.turn}, draw: {}}]);
    }
    this.problemStatement = {}
    gameMode.situation = ["chooseCmd"];
  }
  addLog(text) {
    let textArray = [...this.log.draw.text.text.split("\n"), ...text.split("\n")];
    if (4 < textArray.length) textArray = textArray.slice(-4);
    this.log.draw.text.text = textArray.join("\n");
  }
  manageTime() {
    const date = new Date();
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const hh = String(date.getHours()).padStart(2, "0");
    const mi = String(date.getMinutes()).padStart(2, "0");
    const ss = String(date.getSeconds()).padStart(2, "0");
    const ms = String(date.getMilliseconds()).padStart(2, "0");
    this.event.draw.time.text = `${yyyy}/${mm}/${dd}-${hh}:${mi}:${ss}:${ms}`;
    if (this.event.update.second == -1) {
      this.event.update.second = ss;
      this.event.update.fpsCounter++;
    } else if (this.event.update.second != ss) {
      this.event.draw.fps.text = displayNames.fps + ": " + this.event.update.fpsCounter;
      this.event.update.second = ss;
      this.event.update.fpsCounter = 1;
    } else {
      this.event.update.fpsCounter++;
    }
  }
  updateButton() {//["btn", ("normal" || "back"), btn, col, isDark, shift, newEvt, isDel]
    let rect = this.event.draw;
    for (let i = 0; i < (this.event.update.shift ?? 0); i++) {
      rect = rect.draw;
    }
    rect = rect.rect;
    if (
      (this.event.update.type === "normal" && rect.x <= mousePlace[0] && mousePlace[0] <= rect.x + rect.width && rect.y <= mousePlace[1] && mousePlace[1] <= rect.y + rect.height ||
      this.event.update.type === "back" && isInOfBack(rect.locations[0][0], rect.locations[0][1], rect.locations[2][0] - rect.locations[0][0], rect.locations[2][1] - rect.locations[0][1], rect.locations[0][0] - rect.locations[4][0], mousePlace[0], mousePlace[1])) && !this.isMoving
    ) {
      if (this.event.update.isDark) {
        if (
          this.event.update.type === "normal" && rect.x <= mousePlace[2] && mousePlace[2] <= rect.x + rect.width && rect.y <= mousePlace[3] && mousePlace[3] <= rect.y + rect.height ||
          this.event.update.type === "back" && isInOfBack(rect.locations[0][0], rect.locations[0][1], rect.locations[2][0] - rect.locations[0][0], rect.locations[2][1] - rect.locations[0][1], rect.locations[0][0] - rect.locations[4][0], mousePlace[2], mousePlace[3])
        ) {
          if (
            this.event.update.type === "normal" && rect.x <= mousePlace[4] && mousePlace[4] <= rect.x + rect.width && rect.y <= mousePlace[5] && mousePlace[5] <= rect.y + rect.height ||
            this.event.update.type === "back" && isInOfBack(rect.locations[0][0], rect.locations[0][1], rect.locations[2][0] - rect.locations[0][0], rect.locations[2][1] - rect.locations[0][1], rect.locations[0][0] - rect.locations[4][0], mousePlace[4], mousePlace[5])
          ) {
            console.log("pushedButton");
            [mousePlace[2], mousePlace[3], mousePlace[4], mousePlace[5]] = Array(4).fill(0);
            if (this.event.update.newEvent) {
              if (Array.isArray(this.event.update.newEvent)) {
                this.event.update.newEvent.forEach(element => mainArray.push(element));
              } else {
                mainArray.push(this.event.update.newEvent);
              }
            }
            if (this.event.update.isDelete) {
              deleteObj(this.event, true);
            } else {
              rect.fillColor = Color.darkenColor(this.event.update.color, null, 1, 1);
            }
            if (this.event.update.curseClick) {
              this.isMoving = true;
            }
          } else {
            rect.fillColor = Color.lightenColor(this.event.update.color, null, null, 0);
          }
        }
      } else {
        rect.fillColor = Color.darkenColor(this.event.update.color, null, 1, 1);
        this.event.update.isDark = true;
      }
    } else if (this.event.update.isDark) {
      rect.fillColor = this.event.update.color;
      this.event.update.isDark = false;
      mousePlace[2] = 0;
      mousePlace[3] = 0;
    }
  }
  updateOutset() {//["switchOutset", btn, type, isInBtn, bool]
    let draw = this.event.draw;
    for (let i = 0; i < (this.event.update.shift ?? 0); i++) {
      draw = draw.draw;
    }
    if (this.event.update.isDestruction) {
      console.log("DESTRUCTION ", draw.text.text);
      this.event.update = {};
      return;
    }
    if (this.event.update.type === "cmd" && gameMode.situation === "choosedCmd") {
      if (!this.event.update.isPushed) {
        const isAbove = draw.upper.locations[0][1] < gameMode.place;
        mainArray.push({
          update: {
            name: "move",
            changes: [{
              collections: [...draw.lower.locations,...draw.upper.locations, draw.rect, draw.text],
              key: [...Array(12).fill(1), "y", "y"],
              movement: isAbove ? 4 : -4,
              acceleration: isAbove ? -1 : 1}],
            conditions: [isAbove ? {collections: draw.lower.locations[1], key: 1, op: ">=", value: -10} : {collections: draw.lower.locations[0], key: 1, op: "<=", value: 550}],
            isDelete: true},
          draw: draw
        });
      } else {
        this.cmd = this.event.draw;
        newUpdate.push([10, {
          update: {
            name: "move",
            changes: [{
              collections: [...draw.lower.locations, ...draw.upper.locations, draw.rect, draw.text],
              key: [...Array(12).fill(1), "y", "y"],
              movement: (75 - draw.lower.locations[1][1]) / 16}],
            conditions: [{collections: draw.lower.locations[1], key: 1, op: ">", value: 75}],
            isDelete: false,
            update: {update: {name: "setProgress"}, draw: {}},
            maintain: true
          },
          draw: this.event.draw
        }]);
        const obj = {update: {}, draw: draw};
        mainArray.push(obj);
        newUpdate.push([10, {update: {name: "changeValue", collections: obj, key: "draw", value: {}}, draw: {}}]);
      }
      mainArray.splice(this.index, 1);
      this.index--;
    } else if (draw.upper.locations[0][0] <= mousePlace[0] && mousePlace[0] <= draw.upper.locations[1][0] && draw.upper.locations[0][1] <= mousePlace[1] && mousePlace[1] <= draw.lower.locations[1][1]) {
      if (!this.event.update.isTouch) {
        this.event.update.isTouch = true;
        [draw.lower.fillColor, draw.upper.fillColor] = [draw.upper.fillColor, draw.lower.fillColor];
      } else if (
        draw.upper.locations[0][0] <= mousePlace[2] && mousePlace[2] <= draw.lower.locations[1][0] &&
        draw.upper.locations[0][1] <= mousePlace[3] && mousePlace[3] <= draw.lower.locations[1][1] &&
        draw.upper.locations[0][0] <= mousePlace[4] && mousePlace[4] <= draw.lower.locations[1][0] &&
        draw.upper.locations[0][1] <= mousePlace[5] && mousePlace[5] <= draw.lower.locations[1][1] && !this.event.update.isReject && !this.isMoving && isPointerIgnition && (draw.text.text != "MAGIC" || cat.ability.mp.now >= 25)) {
        console.log("pushedOutset: " + draw.text.text);
        [mousePlace[2], mousePlace[3], mousePlace[4], mousePlace[5]] = Array(4).fill(0);
        this.event.update.isPushed = true;
        if (this.event.update.newEvent) {
          if (Array.isArray(this.event.update.newEvent)) {
            this.event.update.newEvent.forEach(element => mainArray.push(element));
          } else {
            mainArray.push(this.event.update.newEvent);
          }
        }
        if (this.event.update.isDelete) {
          deleteObj(this.event, true);
        }
        if (this.event.update.type === "cmd") Object.assign(gameMode, {situation: "choosedCmd", cmdType: draw.text.text, place: draw.upper.locations[0][1]});
      }
    } else if (this.event.update.isTouch) {
      this.event.update.isTouch = false;
      [draw.lower.fillColor, draw.upper.fillColor] = [draw.upper.fillColor, draw.lower.fillColor];
    }
  }
  updateMove() {
    let isBreak = false;
    for (let i = 0; i < this.event.update.conditions.length && !isBreak; i++) {
      if (this.event.update.conditions[i].op === "<") {
        if (this.event.update.conditions[i].collections[this.event.update.conditions[i].key] >= this.event.update.conditions[i].value) isBreak = true;
      } else if (this.event.update.conditions[i].op === "<=") {
        if (this.event.update.conditions[i].collections[this.event.update.conditions[i].key] > this.event.update.conditions[i].value) isBreak = true;
      } else if (this.event.update.conditions[i].op === ">") {
        if (this.event.update.conditions[i].collections[this.event.update.conditions[i].key] <= this.event.update.conditions[i].value) isBreak = true;
      } else if (this.event.update.conditions[i].op === ">=") {
        if (this.event.update.conditions[i].collections[this.event.update.conditions[i].key] < this.event.update.conditions[i].value) isBreak = true;
      } else if (this.event.update.conditions[i].op === "==") {
        if (this.event.update.conditions[i].collections[this.event.update.conditions[i].key] != this.event.update.conditions[i].value) isBreak = true;
      } else if (this.event.update.conditions[i].op === "!=") {
        if (this.event.update.conditions[i].collections[this.event.update.conditions[i].key] == this.event.update.conditions[i].value) isBreak = true;
      }
      if (isBreak) break;
    }
    if (isBreak) {
      if (this.event.update.isDelete) {
        console.log("end", this.event.draw?.text?.text ?? "not find");
        deleteObj(this.event.draw, true);
      }
      if (this.event.update.update) {
        mainArray.push(this.event.update.update);
      }
      if (this.event.update.maintain) {
        mainArray.push({update: {}, draw: this.event.draw});
      }
      mainArray.splice(this.index, 1);
      this.index--;
    } else {
      for (let i = 0; i < this.event.update.changes.length; i++) {//[[arr, idx, mvmt], [arr, idx, mvmt], ...]
        this.event.update.changes[i].movement += (this.event.update.changes[i].acceleration ? this.event.update.changes[i].acceleration : 0);
        //this.event.update.changes[i].movement = (this.event.update.changes[i].func ? this.event.update.changes[i].func() : this.event.update.changes[i].movement);
        if (this.event.update.changes[i].accessories) {
          for (let j = 0; j < this.event.update.changes[i].collections.length; j++) {
            this.event.update.changes[i].collections[j][this.event.update.changes[i].key[j]] = parseInt(this.event.update.changes[i].collections[j][this.event.update.changes[i].key[j]].slice(0, -this.event.update.changes[i].accessories + 1)) + this.event.update.changes[i].movement + this.event.update.changes[i].collections[j][this.event.update.changes[i].key[j]].slice(-this.event.update.changes[i].accessories);
          }
        } else {
          for (let j = 0; j < this.event.update.changes[i].collections.length; j++) {
            this.event.update.changes[i].collections[j][this.event.update.changes[i].key[j]] += this.event.update.changes[i].movement;
          }
        }
      }
    }
  }
  characterMotion() {
    if (!this.event.update.endFirst) {
      console.log(this.event);
      if (displayLog) this.addLog(this.event.update.log[0] + (this.event.update.returns.logNumber ?? "") + this.event.update.log[1]);
      this.event.update.endFirst = true;
      this.event.update.turns = this.event.update.turns ? this.event.update.turns : 20;
      this.event.update.turn = this.event.update.turns;
      this.event.update.place = 0;
      this.event.update.theta = 0;
      this.event.update.thetaChange = Math.PI * 6 / this.event.update.turns;
      this.event.update.amplitude = 100 * this.event.update.returns.damageRate;
      this.event.update.amplitudeChange = this.event.update.amplitude / this.event.update.turns;
      this.event.update.hpBarChange = 75 * this.event.update.returns.damageRate / this.event.update.turns;
      console.log("updatetype", this.event.update.type);
      if (this.event.update.type === "magic") {
        this.event.update.mpBarChange = 75 * this.event.update.returns.useMpRate / this.event.update.turns;
      }
      if (this.event.update.type === "magic" && Character.magics[this.event.update.id].name === "heal" || this.event.update.type === "item") {
        this.event.update.hpBarChange = -75 * this.event.update.returns.healRate / this.event.update.turns;
      }
      this.event.draw = {text: {name: "text", fillColor: "red", font: "normal 23px " + fontType, text: String(this.event.update.returns.damage), x: this.event.update.target.draw.border.x + this.event.update.target.draw.border.width * 3 / 4, y: this.event.update.target.draw.border.y - 10}};
      console.log(this.event.update);
      const rate = this.event.update.returns.hpNow / this.event.update.returns.hpMax;
      if (rate > 0.5) {
        this.event.update.target.draw.border.borderColor = "green";
      } else if (rate > 0.3) {
        this.event.update.target.draw.border.borderColor = "yellow";
      } else if (rate != 0) {
        this.event.update.target.draw.border.borderColor = "orange";
      } else {
        this.event.update.target.draw.border.borderColor = "red";
      }
    }
    const before = this.event.update.place;
    this.event.update.theta += this.event.update.thetaChange;
    this.event.update.amplitude -= this.event.update.amplitudeChange;
    this.event.update.place = this.event.update.amplitude * (this.event.update.sign ?? 1) * Math.sin(this.event.update.theta);
    for (const key in this.event.update.target.draw) {
      if (this.event.update.target.draw.hasOwnProperty(key)) {
        this.event.update.target.draw[key].x += this.event.update.place - before;
      }
    }
    this.event.draw.text.fillColor =`rgba(${0 < this.event.update.hpBarChange ? "255, 0, 0" : 0 > this.event.update.hpBarChange ? "0, 255, 0" : "178, 178, 178"}, ${this.event.update.turn / this.event.update.turns})`;
    this.event.draw.text.y--;
    this.event.update.target.draw.frontHpBar.width -= this.event.update.hpBarChange;
    if (this.event.update.type === "magic") {
      this.event.update.origin.draw.frontMpBar.width -= this.event.update.mpBarChange;
    }
    this.event.update.turn--;
    if (!this.event.update.turn) {
      this.event.update.target.draw.hpNumber.text = String(this.event.update.returns.hpNow) + " / " + String(this.event.update.returns.hpMax);
      if (this.event.update.type === "magic") {
        this.event.update.origin.draw.mpNumber.text = String(this.event.update.returns.mpNow) + " / " + String (this.event.update.returns.mpMax);
      }
      mainArray.splice(this.index, 1);
      this.index--;
      return;
    }
  }
  stableInput() {
    if (!this.event.update.input || this.event.update.isEnd) {
      mainArray.splice(this.index, 1);
      this.index--;
      return;
    }
    this.event.update.y--;
    this.event.update.input.style.left = canvas.getBoundingClientRect().left + this.event.update.x + "px";
    this.event.update.input.style.top = canvas.getBoundingClientRect().top + this.event.update.y + "px";
  }
  createCracker() {
    const pieces = {update: {name: "cracker", infomations: [], gravity: (this.event.update.gravity ?? 1)}, draw: []};
    const numberOfPieces = Math.floor(Math.random() * (this.event.update.maxPieces - this.event.update.minPieces)) + this.event.update.minPieces;
    for (let i = 0; i < numberOfPieces; i++) {
      const direction = Math.random() * (this.event.update.maxArc - this.event.update.minArc) + this.event.update.minArc;
      const speed = Math.random() * (this.event.update.maxSpeed - this.event.update.minSpeed) + this.event.update.minSpeed;
      pieces.update.infomations.push({speedX: Math.cos(direction) * speed, speedY: Math.sin(direction) * speed, life: Math.floor(Math.random() * (this.event.update.maxLife - this.event.update.minLife)) + this.event.update.minLife, restLife: (this.event.update.life ?? 60)});
      pieces.draw.push({name: "arc", x: this.event.update.x, y: this.event.update.y, r: Math.random() * (this.event.update.maxSize - this.event.update.minSize) + this.event.update.minSize, start: 0, end: Math.PI * 2, fillColor: `hsl(${Math.random() * 360}, 80%, 60%)`, borderColor: transparent, alpha: 1, connect: true});
    }
    mainArray.push(pieces);
    mainArray.splice(this.index, 1);
    this.index--;
    console.log("startCracker!");
  }
  cracker() {
    for (let i = 0; i < this.event.update.infomations.length; i++) {
      if (this.event.update.infomations[i].restLife == 0) {
        this.event.update.infomations.splice(i, 1);
        this.event.draw.splice(i, 1);
        i--;
        continue;
      }
      this.event.draw[i].x += this.event.update.infomations[i].speedX;
      this.event.draw[i].y += this.event.update.infomations[i].speedY;
      this.event.update.infomations[i].speedY += this.event.update.gravity;
      this.event.draw[i].alpha = this.event.update.infomations[i].restLife / this.event.update.infomations[i].life * 3;
      this.event.update.infomations[i].restLife--;
    }
  }
  drawCanvas() {
    console.log("Hello!", isPushing, this.event.update.x, this.event.update.y);
    if (
      this.event.draw.canvas.x < this.event.update.x &&
      this.event.update.x < this.event.draw.canvas.x + this.event.update.width &&
      this.event.draw.canvas.y < this.event.update.y &&
      this.event.update.y < this.event.draw.canvas.y + this.event.update.height &&
      isPushing
    ) {
      console.log("Hello, World!", this.event.update.x, this.event.update.y, mousePlace[0], mousePlace[1], this.event.draw.canvas.x, this.event.draw.canvas.y);
      this.subCtx.beginPath();
      this.subCtx.lineWidth = 2;
      this.subCtx.strokeStyle = "black";
      this.subCtx.moveTo(this.event.update.x - this.event.draw.canvas.x, this.event.update.y - this.event.draw.canvas.y);
      this.subCtx.lineTo(mousePlace[0] - this.event.draw.canvas.x, mousePlace[1] - this.event.draw.canvas.y);
      this.subCtx.stroke();
    }
    this.event.update.x = isPushing ? mousePlace[0] : null;
    this.event.update.y = isPushing ? mousePlace[1] : null;
  }
}
class Draw {
  constructor() {
    this.branch = {
      empty: () => {},
      clip: this.clip.bind(this),
      img: this.drawImg.bind(this),
      border: this.drawBorder.bind(this),
      text: this.drawText.bind(this),
      rect: this.drawRect.bind(this),
      poly: this.drawPoly.bind(this),
      arc: this.drawArc.bind(this),
      lines: this.drawLines.bind(this)
    }
  }
  draw() {
    if (afterimage) {
      ctx.fillStyle = "rgb(255 255 255 / 20%)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    for (let index = 0; index < mainArray.length; index++) {
      this.funcLinker(mainArray[index].draw);
    }
  }
  funcLinker(element) {
    if (Array.isArray(element)) {
      for (let i = 0; i < element.length; i++) this.funcLinker(element[i]);
    } else if (element.name === undefined || element.name === null) {
      for (const key in element) {
        if (element.hasOwnProperty(key)) {
          this.funcLinker(element[key]);
        }
      }
    } else {
      this.branch[element.name](element);
    }
  }
  expantion(element) {
    const array = [];
    if (Array.isArray(element)) {
      for (let i = 0; i < element.length; i++) arr.push(...this.expantion(element[i]));
    } else if (element.name === undefined || element.name === null) {
      for (const key in element) {
        if (element.hasOwnProperty(key)) {
          arr.push(...this.expantion(element[key]));
        }
      }
    } else {
      arr.push(element);
    }
    return arr;
  }
  clip(element) {
    ctx.save();
    ctx.beginPath();
    if (Array.isArray(element.rect[0])) {
      element.rect.forEach(x => ctx.rect(...x));
    } else {
      ctx.rect(...element.rect);
    }
    ctx.clip();
    this.funcLinker(element.draw);
    ctx.restore();
  }
  correction(element) {
    const array = this.expantion(element.draw);
    for (let i = 0; i < array.length; i++) {
      const deep = structuredClone(array[i]);
      if (array[i].name == "poly") {
        for (let j = 0; j < array[i].locations.length; j++) {
          deep.locations[i][0] += element.x;
          deep.locations[i][1] += element.y;
        }
      } else if (array[i].name == "lines") {
        for (let j = 0; j < array[i].x.length(); j++) deep.x[j] += element.x;
        for (let j = 0; j < array[i].y.length(); j++) deep.y[j] += element.y;
      } else {
        deep.x += element.x;
        deep.y += element.y;
      }
      this.funcLinker(deep);
    }
  }
  /**
   * 画像の描画
   * @param {drawImgObject} element 
   */
  drawImg(element) {
    //if (!element.img.complete || element.img.naturalWidth === 0) return;
    try {
      ctx.imageSmoothingEnabled = element.img.classList.contains("pixel") ? false : true;
      const width = element.width;
      const height = element.height ? element.height : width * element.img.naturalHeight / element.img.naturalWidth;
      const x = element.center ? element.x - element.width / 2 : element.x;
      const y = element.center ? element.y - height / 2 : element.y;
      if (element.sprite) {
        ctx.drawImage(element.img, element.sprite.x, element.sprite.y, element.sprite.width, element.sprite.height, x, y, width, height);
      } else {
        ctx.drawImage(element.img, x, y, width, height);
      }
      ctx.imageSmoothingEnabled = true;
    } catch(e) {
      console.log("error found: " + e);
    }
  }
  /**
   * 枠線の描画
   * @param {drawBorderObject} element 
   */
  drawBorder(element) {
    ctx.strokeStyle = element.borderColor ?? "black";
    ctx.lineWidth = element.borderWidth ?? 1;
    ctx.strokeRect(element.x, element.y, element.width, element.height);
  }
  /**
   * 文章の描画
   * @param {drawTextObject} element 
   */
  drawText(element) {
    ctx.font = element.font ?? "normal 17px " + fontType;
    ctx.textAlign = element.textAlign ?? "start";
    ctx.textBaseline = element.textBaseline ?? "middle";
    ctx.fillStyle = element.fillColor ?? "black";
    ctx.strokeStyle = element.borderColor ?? "black";
    ctx.lineWidth = element.borderWidth ?? 0;
    if (element.lineHeight === undefined) element.lineHeight = 20;
    const lines = element.text.split("\n");
    if (element.setTop) {
      lines.forEach((line, i) => {
        ctx.fillText(line, element.x, element.y + element.lineHeight * i);
      });
    } else if (element.setBottom) {
      lines.forEach((line, i) => {
        ctx.fillText(line, element.x, element.y + element.lineHeight * (i - lines.length + 1));
      });
    } else {
      lines.forEach((line, i) => {
        ctx.fillText(line, element.x, element.y + element.lineHeight * (i - lines.length * 0.5 + 0.5));
      });
    }
    ctx.textAlign = "start";
    ctx.textBaseline = "middle";
  }
  /**
   * 長方形の描画
   * @param {drawRectObject} element 
   */
  drawRect(element) {
    ctx.fillStyle = element.fillColor ?? transparent;
    ctx.strokeStyle = element.borderColor ?? "black";
    ctx.lineWidth = element.borderWidth ?? 0;
    ctx.fillRect(element.x, element.y, element.width, element.height);
    ctx.strokeRect(element.x, element.y, element.width, element.height);
  }
  /**
   * 多角形の描画
   * @param {drawPolyObject} element 
   */
  drawPoly(element) {
    ctx.fillStyle = element.fillColor ?? transparent;
    ctx.strokeStyle = element.borderColor ?? "black";
    ctx.lineWidth = element.borderWidth ?? 0;
    const locationX = element.locations.map(sub => sub[0]);
    const locationY = element.locations.map(sub => sub[1]);
    ctx.beginPath();
    ctx.moveTo(locationX[0], locationY[0]);
    for (let i = 1; i < element.locations.length; i++) {
      ctx.lineTo(locationX[i], locationY[i]);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
  /**
   * 扇型の描画
   * @param {drawArcObject} element 
   */
  drawArc(element) {
    ctx.fillStyle = element.fillColor ?? transparent;
    ctx.strokeStyle = element.borderColor ?? "black";
    ctx.lineWidth = element.borderWidth ?? 0;
    ctx.globalAlpha = element.alpha ?? 1,
    ctx.beginPath();
    ctx.arc(element.x, element.y, element.r, (element.start ?? 0), (element.end ?? Math.PI * 2), (element.reverse ?? false));
    if (element.connect) {
      ctx.closePath();
      ctx.fill();
    }
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
  drawLines(element) {
    ctx.strokeStyle = element.color ?? "black";
    ctx.lineWidth = element.width ?? 1;
    ctx.beginPath();
    ctx.moveTo(element.x[0], element.y[0]);
    for (let i = 1; i < element.x.length; i++) {
      if (element.exclusion?.includes(i) ?? false) {
        ctx.moveTo(element.x[i], element.y[i]);
      } else {
        ctx.lineTo(element.x[i], element.y[i]);
      }
    }
    ctx.stroke();
  }
}
const intervalFps = 1000 / fps;
let accumulator = 0;
let prevTime = 0;
let isFirstLap = true;
const updater = new Update();
const drawer = new Draw();
function loop(time) {
  if (!prevTime) prevTime = time;
  accumulator += time - prevTime;
  prevTime = time;
  if (intervalFps <= accumulator) {
    accumulator = (accumulator - intervalFps) % 10;
    updater.update();
    drawer.draw();
    isFirstLap = false;
    isPointerIgnition = false;
  }
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
