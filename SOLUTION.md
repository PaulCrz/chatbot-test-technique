# Partie 2 - Solution

# 📘 Spécification de l’interface et du modèle de données

## 🎯 Objectif

L’énoncé indique que l’objectif est de **guider l’utilisateur** dans la formulation de sa demande. Cela suppose une solution **développée côté client (interface)**, tout en **facilitant l’interprétation des données côté serveur**.

Pour cela, une approche simple et robuste consiste à **uniformiser la communication client ⇒ serveur** en définissant un **modèle de données structuré et constant**, ce qui :

- simplifie la logique d’interprétation côté serveur
- réduit les risques d’erreurs

---

## 🧱 Modèle de données : Requête client ⇒ serveur

Voici une définition typée du modèle de données, permettant de structurer la requête envoyée par le client :

```tsx
/** Base interface for any type of data */
export interface ResultBase {
  id: string;
  name: string;
}

/** Possible item category values */
export type ItemCategory = "towel" | "sheet" | "pillow_case";

export interface Item extends ResultBase {
  category: ItemCategory;
}

/** Possible request option values */
export type OptionType = "item_stock" | "item_lost" | "item_report" | "item_desc" | "loc_desc";

export interface Option extends ResultBase {
  description: string;
  ask_for_item: boolean;
  ask_for_location: boolean;
}

/** Represents a user request */
export interface Request {
  /** Request target option */
  option?: Option;
  /** Request target item(s) */
  items: Item[];
  /** Request target location(s) */
  locations: Location[];
}

```

---

## 💡 Proposition de solution

À partir des fichiers CSV fournis et des instructions de l’énoncé, nous proposons un système permettant à l’utilisateur de formuler sa demande de manière **guidée** et **intuitive**.

Plutôt qu’un champ libre de type “chat” servant à filtrer les données, l’utilisateur est **accompagné étape par étape** pour sélectionner les éléments pertinents à sa requête.

---

## 🧭 Parcours utilisateur

L’interface guide l’utilisateur selon le chemin suivant :

```
Option ⇒ Item(s) ⇒ Location(s) ⇒ Envoie de la requête
```

Chaque étape permet de réduire les risques d’erreurs et de garantir que la requête finale soit **cohérente** et **comprise par le backend**.

---

## 🖥️ Description de l’interface

L’interface comprend les éléments suivants :

- ✅ Une **phrase d’information** pour guider l’utilisateur.
- 📊 Une **zone de résultats** affichant les données disponibles, récupérées du backend.
- 📦 Une **zone de sélection** (au-dessus des résultats), regroupant les éléments déjà choisis.
- 🔍 Un **champ de recherche** textuel pour filtrer les résultats par nom.
- 🧰 Un **bouton de filtrage** (utile en cas de nombreux résultats).
- ⏭️ Un **bouton "Suivant" ou "Envoyer"**, permettant de passer à l’étape suivante ou de soumettre la requête.

---

## ✅ Avantages de cette approche

- L’utilisateur **ne manipule pas directement la structure** de la requête.
- **Moins d’erreurs** liées à la saisie ou au format.
- Une **expérience utilisateur fluide et intuitive**.
- Une **intégration serveur fiable** grâce à une structure de données uniforme.
