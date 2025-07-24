// SPDX-License-Identifier: EUPL-1.2
// SPDX-FileCopyrightText: 2025 Pierre Bourdon <delroth@gmail.com>

import { Fragment, useState } from 'react'
import './App.css'

import CodeEditor from '@uiw/react-textarea-code-editor'

import { default as defaultCardObject } from './DefaultCard.jsx'

const ENERGIES = ["Grass", "Fire", "Water", "Lightning", "Psychic", "Fighting",
                  "Darkness", "Metal", "Fairy", "Dragon", "Colorless"]

function cleanUpCard(card) {
  // Auto-set properties that need to be auto-set.
  if (card.number) {
    card.numberSortingOrder = parseInt(card.number);
  }

  if (card.supertype == "Pokémon") {
    if (!card.pokemonStage) {
      card.pokemonStage = "Basic";
    }

    if (card.pokemonStage == "Basic") {
      delete card.evolvesFrom;
    }

    delete card.description;
    delete card.evolvesInto;
  } else {
    delete card.pokemonStage;
    delete card.hitPoints;
    delete card.energyTypes;
    delete card.weaknesses;
    delete card.resistances;
    delete card.retreatCost;
    delete card.pokedexNumbers;
  }
}

function MultiTypeEditField({ id, label, placeholder, value, values, type = "str", onChange }) {
  let inputElem;
  if (type == "bool") {
    inputElem = <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} />
  } else if (values) {
    let unknownValue = false;
    value = value ?? "";
    if (!values.includes(value)) {
      values = values.concat([value]);
      unknownValue = true;
    }
    inputElem = (
      <select id={id} className={unknownValue ? "invalid-value" : null} value={value ?? ""} onChange={(e) => onChange(e.target.value)}>
        {values.map((e) => <option key={e}>{e}</option>)}
      </select>
    )
  } else {
    inputElem = <input id={id} type="text" placeholder={placeholder} value={value ?? ""} onChange={(e) => {
      let v = e.target.value || null;
      if (v) {
        if (type == "csv") {
          v = v.split(",");
        } else if (type == "csi") {
          v = v.split(",").map(parseInt).filter((x) => (x > 0));
        }
      } else if (type == "csv" || type == "csi") {
        v = [];
      }
      onChange(v);
    }} />
  }

  if (label) {
    return (
      <>
        <label>{label}</label>
        {inputElem}
      </>
    );
  } else {
    return inputElem;
  }
}

function ExpansionInfoEdit({ id, field, label, placeholder, values, type = "str", card, onChange }) {
  return <MultiTypeEditField id={id} label={label} placeholder={placeholder} values={values} value={card.expansion?.[field]} type={type} onChange={(v) => {
    card.expansion = card.expansion || {};
    card.expansion[field] = v;
    onChange(card);
  }} />
}

function CardInfoEdit({ id, field, label, placeholder, values, type = "str", card, onChange }) {
  return <MultiTypeEditField id={id} label={label} placeholder={placeholder} values={values} value={card[field]} type={type} onChange={(v) => {
    card[field] = v;
    onChange(card);
  }} />
}

function EnergySelector({ value, small = false, onChange }) {
  const [editMode, setEditMode] = useState(false);

  return <>
    <i className={(small ? "e-small " : "") + "e-" + (value || "colorless").toLowerCase()}
            style={{ cursor: "pointer" }}
            onClick={(e) => setEditMode(!editMode)}></i>
    {editMode && <div className="energies-list">
      {ENERGIES.map((e) =>
        <i key={e} className={"e-small e-" + e.toLowerCase()}
           style={{ cursor: "pointer" }}
           onClick={(_) => {
             setEditMode(false);
             onChange(e);
            }}></i>
      )}
    </div>}
  </>
}

function EnergyTypeEdit({ id, card, onChange }) {
  return <div id={id}>
    <EnergySelector value={card.energyTypes?.[0]} onChange={(e) => {
      if (!e) {
        card.energyTypes = [];
      } else {
        card.energyTypes = [e];
      }
      onChange(card);
    }} />
  </div>;
}

function WeakResEdit({ name, field, def, card, onChange }) {
  let val = card[field] || [];

  return <div className="resource">
    <h4>
      {name}
      <button className="btn-small" onClick={(e) => {
        val.push({ "type": "Colorless", "value": def, "sortingOrder": val.length + 1 });
        card[field] = val;
        onChange(card);
      }}>+</button>
    </h4>
    <div>
      {val.map((wr, i) => <div key={i}>
        <EnergySelector small={true} value={wr["type"]} onChange={(e) => { card[field][i].type = e; onChange(card) }} />
        <input type="text" value={wr.value} onChange={(e) => { card[field][i].value = e.target.value; onChange(card) }} />
        <button className="btn-small" onClick={(e) => {
          card[field].splice(i, 1);
          for (let j = i; j < card[field].length; ++j) {
            card[field][j].sortingOrder -= 1;
          }
          onChange(card);
        }}>×</button>
      </div>)}
    </div>
  </div>
}

function RetreatCostEdit({ card, onChange }) {
  function addToRetreatCost(delta) {
    card.retreatCost = (card.retreatCost || 0) + delta;
    onChange(card);
  }
  const empty = card.retreatCost <= 0;
  return <div className="resource">
    <h4>
      retreat
      <button className="btn-small btn-add" onClick={() => addToRetreatCost(1)}>+</button>
      <button className={`btn-small btn-sub ${empty ? "hidden" : ""}`} onClick={() => addToRetreatCost(-1)}>–</button>
    </h4>
    <div>
      {[...Array(card.retreatCost || 0)].map((_, i) => <i key={i} className="e-colorless e-small"></i>)}
    </div>
  </div>
}

function EffectsEdit({ id, card, onChange }) {
  let effects = card.effects || [];

  return <div id={id}>
    {effects.map((effect, i) => <Fragment key={i}>
      <div className="pokemon-effect">
        <div className="pokemon-effect-type">
          <input type="text" placeholder="Effect type" value={effect.type} onChange={(e) => {
            effect.type = e.target.value;
            onChange(card);
          }} />
        </div>
        <div className="pokemon-effect-name">
          <input type="text" placeholder="Effect name" value={effect.name} onChange={(e) => {
            effect.name = e.target.value;
            onChange(card);
          }} />
        </div>
      </div>
      <div className="pokemon-effect-description">
        <div><button className="btn-small" onClick={(e) => {
          effects.splice(i, 1);
          for (let j = i; j < effects.length; ++j) {
            effects[j].sortingOrder -= 1;
          }
          onChange(card);
        }}>×</button></div>
        <textarea placeholder="Effect text" value={effect.description} onChange={(e) => {
          effect.description = e.target.value;
          onChange(card);
        }} />
      </div>
    </Fragment>)}
    <button onClick={(e) => {
      effects.push({
        "type": "",
        "name": "",
        "description": "",
        "sortingOrder": effects.length + 1,
      });
      card.effects = effects;
      onChange(card);
    }}>Add effect</button>
  </div>
}

function compressEnergies(uncompressed) {
  if (!uncompressed.length) {
    return [];
  }
  let compressed = [];
  let prev = uncompressed[0];
  let count = 1;
  let sortingOrder = 1;
  for (let i = 1; i < uncompressed.length; ++i) {
    if (uncompressed[i] == prev) {
      count++;
    } else {
      compressed.push({ "type": prev, "quantity": count, "sortingOrder": sortingOrder });
      prev = uncompressed[i];
      count = 1;
      sortingOrder += 1;
    }
  }
  compressed.push({ "type": prev, "quantity": count, "sortingOrder": sortingOrder });
  return compressed;
}

function AttackEnergiesEdit({ energies, onChange }) {
  let uncompressed = [];
  energies.map((e) => {
    for (let i = 0; i < e.quantity || 0; ++i) {
      uncompressed.push(e.type);
    }
  });

  return <div className="pokemon-attack-energies">
    <div className="vertical-stack">
      <button className="btn-small btn-add" onClick={(e) => {
        uncompressed.push("Colorless");
        onChange(compressEnergies(uncompressed));
      }}>+</button>
      <button className={"btn-small btn-sub" + (uncompressed.length == 0 ? " hidden" : "")} onClick={(e) => {
        uncompressed.pop();
        onChange(compressEnergies(uncompressed));
      }}>–</button>
    </div>
    {uncompressed.map((e, j) => (
      <EnergySelector key={j} value={e} onChange={(e) => { uncompressed[j] = e; onChange(compressEnergies(uncompressed)); }} />
    ))}
  </div>;
}

function AttacksEdit({ id, card, onChange }) {
  let attacks = card.attacks || [];

  return <div id={id}>
    {attacks.map((atk, i) => <Fragment key={i}>
      <div className="pokemon-attack">
        <AttackEnergiesEdit energies={atk.energies || []} onChange={(e) => { atk.energies = e; onChange(card); }} />
        <div className="pokemon-attack-name">
          <input type="text" placeholder="Attack name" value={atk.name} onChange={(e) => {
            atk.name = e.target.value;
            onChange(card);
          }} />
        </div>
        <div className="pokemon-attack-damage">
          <input type="text" placeholder="DMG" value={atk.damage} onChange={(e) => {
            if (e.target.value) {
              atk.damage = e.target.value;
            } else {
              delete atk.damage;
            }
            onChange(card);
          }} />
        </div>
      </div>
      <div className="pokemon-attack-description">
        <div><button className="btn-small" onClick={(e) => {
          card.attacks.splice(i, 1);
          for (let j = i; j < card.attacks.length; ++j) {
            card.attacks[j].sortingOrder -= 1;
          }
          onChange(card);
        }}>×</button></div>
        <textarea placeholder="Description" value={atk.description} onChange={(e) => {
          if (e.target.value) {
            atk.description = e.target.value;
          } else {
            delete atk.description;
          }
          onChange(card);
        }} />
      </div>
    </Fragment>)}
    <button onClick={(e) => {
      attacks.push({
        "name": "",
        "energies": [{ "type": "Colorless", "quantity": 1, "sortingOrder": 1 }],
        "sortingOrder": attacks.length + 1,
      });
      card.attacks = attacks;
      onChange(card);
    }}>Add attack</button>
  </div>
}

function CardRulesEdit({ id, card, onChange }) {
  let rules = card.rules || [];

  return <div id={id}>
    {rules.map((rule, i) => <div key={i} className="card-rule">
      <div><button className="btn-small" onClick={(e) => {
        rules.splice(i, 1);
        for (let j = i; j < rules.length; ++j) {
          rules[j].sortingOrder -= 1;
        }
        onChange(card);
      }}>×</button></div>
      <textarea placeholder="Rule text" value={rule.description} onChange={(e) => {
        rule.description = e.target.value;
        onChange(card);
      }} />
    </div>)}
    <button onClick={(e) => {
      rules.push({
        "description": "",
        "sortingOrder": rules.length + 1,
      });
      card.rules = rules;
      onChange(card);
    }}>Add rule</button>
  </div>
}

function App() {
  const [cardObj, setCardObj] = useState(JSON.parse(defaultCardObject));
  const [cardJsonText, setCardJsonText] = useState(defaultCardObject);
  const [parseWarnings, setParseWarnings] = useState("");

  function setCardObjAndText(cardObj) {
    cleanUpCard(cardObj);
    setCardObj(cardObj);
    setCardJsonText(JSON.stringify(cardObj, null, 2));
    setParseWarnings("");
  }

  return (
    <>
      <div id="controls-column">
        <button>Export card</button>
        <section>
          <h4 className="box-header">Expansion info</h4>
          <div className="box meta">
            <ExpansionInfoEdit field="id" label="ID" card={cardObj} onChange={setCardObjAndText} />
            <ExpansionInfoEdit field="name" label="Name" card={cardObj} onChange={setCardObjAndText} />
            <ExpansionInfoEdit field="series" label="Series" card={cardObj} onChange={setCardObjAndText} />
            <ExpansionInfoEdit field="tcgRegion" label="Region" card={cardObj} onChange={setCardObjAndText} />
            <ExpansionInfoEdit field="code" label="Code" card={cardObj} onChange={setCardObjAndText} />
            <ExpansionInfoEdit field="releaseDate" label="Release date" card={cardObj} onChange={setCardObjAndText} />
            <ExpansionInfoEdit field="cardNumberRightPart" label="Card number right part" card={cardObj} onChange={setCardObjAndText} />
          </div>
        </section>
        <section>
          <h4 className="box-header">Card metadata</h4>
          <div className="box meta">
            <CardInfoEdit field="supertype" label="Supertype" values={["Pokémon", "Trainer", "Energy"]} card={cardObj} onChange={setCardObjAndText} />
            <CardInfoEdit field="types" label="Types" type="csv" card={cardObj} onChange={setCardObjAndText} />
            <CardInfoEdit field="pokedexNumbers" label="Pokédex numbers" type="csi" card={cardObj} onChange={setCardObjAndText} />
            <CardInfoEdit field="format" label="Format" values={["Unlimited", "Expanded", "Standard"]} card={cardObj} onChange={setCardObjAndText} />
            <CardInfoEdit field="rarity" label="Rarity" card={cardObj} onChange={setCardObjAndText} />
            <CardInfoEdit field="regulationMark" label="Regulation mark" card={cardObj} onChange={setCardObjAndText} />
            <CardInfoEdit field="isComplete" label="Complete?" type="bool" card={cardObj} onChange={setCardObjAndText} />
            <CardInfoEdit field="needsReview" label="Needs review?" type="bool" card={cardObj} onChange={setCardObjAndText} />
          </div>
        </section>
        <section>
          <h4 className="box-header">Variants</h4>
          <div className="box">
        </div>
        </section>
        <button onClick={() => {
          if (confirm("Do you really want to reset the current card?")) {
            setCardObjAndText(JSON.parse(defaultCardObject));
          }
        }}>
          Reset card
        </button>
      </div>

      <div id="card-editor-column">
        <div id="card">
          <div id="card-head">
            {cardObj.supertype == "Pokémon" &&
              <CardInfoEdit id="pokemon-stage" field="pokemonStage" values={["Basic", "Stage 1", "Stage 2"]} card={cardObj} onChange={setCardObjAndText} />}

            <CardInfoEdit id="card-name" placeholder="Card name" field="name" card={cardObj} onChange={setCardObjAndText} />

            {cardObj.supertype == "Pokémon" && cardObj.pokemonStage != "Basic" && <>
              <div id="pokemon-evolves-from">
                Evolves from
                <CardInfoEdit placeholder="Name" field="evolvesFrom" card={cardObj} onChange={setCardObjAndText} />
              </div>
             </>}

            {cardObj.supertype == "Pokémon" && <>
              <span id="pokemon-hp-label">HP</span>
              <CardInfoEdit id="pokemon-hp" placeholder="HP" field="hitPoints" card={cardObj} onChange={setCardObjAndText} />
              <EnergyTypeEdit id="pokemon-energy-type" card={cardObj} onChange={setCardObjAndText} />
              </>}
          </div>

          <div id="card-art"></div>

          {cardObj.supertype == "Pokémon" && <>
            <div id="pokemon-card-text">
              <EffectsEdit id="pokemon-effects" card={cardObj} onChange={setCardObjAndText} />
              <AttacksEdit id="pokemon-attacks" card={cardObj} onChange={setCardObjAndText} />
            </div>

            <div id="pokemon-res-bar">
              <WeakResEdit name="weakness" field="weaknesses" def="x2" card={cardObj} onChange={setCardObjAndText} />
              <WeakResEdit name="resistance" field="resistances" def="-30" card={cardObj} onChange={setCardObjAndText} />
              <RetreatCostEdit card={cardObj} onChange={setCardObjAndText} />
            </div>
          </>}

          {cardObj.supertype != "Pokémon" && <>
            <CardInfoEdit id="card-description" placeholder="Description" field="description" type="multiline" card={cardObj} onChange={setCardObjAndText} />
          </>}

          <div id="card-foot">
            <div id="card-illustrator">
              <label>Illus. </label>
              <CardInfoEdit placeholder="Illustrator" field="illustrators" type="csv" card={cardObj} onChange={setCardObjAndText} />
            </div>
            <CardInfoEdit id="card-number" placeholder="Number" field="number" card={cardObj} onChange={setCardObjAndText} />

            <CardRulesEdit id="card-rules" card={cardObj} onChange={setCardObjAndText} />
          </div>
        </div>
      </div>

      <div id="json-editor-column">
        <div id="json-editor">
          <CodeEditor
            value={cardJsonText}
            language="json"
            onChange={(e) => {
              let pw = "";
              setCardJsonText(e.target.value)
              try {
                const newCardObj = JSON.parse(e.target.value);
                setCardObj(newCardObj);
              } catch (e) {
                pw = e.message;
              }
              setParseWarnings(pw);
            }}
            minHeight={805}
            style={{
              fontFamily: "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
              fontSize: "110%",
            }}
          />
        </div>
        <pre id="parse-warnings">{parseWarnings}</pre>
      </div>
    </>
  )
}

export default App
