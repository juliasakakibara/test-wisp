"use client";

import { useState } from "react";

/** Toppings the page can be served as. "julia" is the base (no attribute); the rest are scoped CSS. */
const TOPPINGS = [
  { id: "julia", label: "Julia" },
  { id: "pancake", label: "Pancake" },
  { id: "crepe", label: "Crêpe Expectations" },
] as const;

type ToppingId = (typeof TOPPINGS)[number]["id"];

function readTopping(): ToppingId {
  if (typeof document === "undefined") return "julia";
  const current = document.documentElement.dataset.topping;
  return TOPPINGS.some((t) => t.id === current) ? (current as ToppingId) : "julia";
}

/** Swap the topping on <html>, with a short transition window for colours and corners. */
function applyTopping(next: ToppingId) {
  const root = document.documentElement;
  root.setAttribute("data-topping-swapping", "");
  if (next === "julia") root.removeAttribute("data-topping");
  else root.setAttribute("data-topping", next);
  window.setTimeout(() => root.removeAttribute("data-topping-swapping"), 450);
}

/**
 * The live proof of "same batter, any brand": re-serves the whole page in another
 * Pancake topping. Same components and code; only the tokens change. The choice
 * lives on <html>, so it survives client-side navigation into a case.
 */
export function ToppingSwitch({ variant }: { variant?: "node" } = {}) {
  const [topping, setTopping] = useState<ToppingId>(readTopping);

  function pick(next: ToppingId) {
    applyTopping(next);
    setTopping(next);
  }

  return (
    <fieldset className={`topping-switch${variant ? ` topping-switch--${variant}` : ""}`}>
      <legend className="topping-switch__legend">Served as</legend>
      <div className="topping-switch__options">
        {TOPPINGS.map((t) => (
          <label key={t.id} className="topping-switch__option">
            <input
              type="radio"
              name="topping"
              value={t.id}
              checked={topping === t.id}
              onChange={() => pick(t.id)}
              className="topping-switch__input"
            />
            <span className="topping-switch__label">{t.label}</span>
          </label>
        ))}
      </div>
      <p className="topping-switch__note">Same page, same code. Only the topping changes.</p>
    </fieldset>
  );
}
