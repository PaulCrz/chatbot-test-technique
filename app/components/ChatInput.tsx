"use client";

import { useState, useEffect, memo } from "react";

import {
  getAvailableOptions, getAvailableItems, getAvailableLocations,
  getItemFilters, getLocationFilters,
  ResultBase, Option, Item, Location,
} from "@/lib/fetch";

import ChipList from "./ChipList";
import FilterDropdown from "./FilterDropdown";
import SearchBar from "./SearchBar";

/** Represent an user request */
export interface Request {
  /** Request target option */
  option?: Option;
  /** Request target item(s) */
  items: Item[];
  /** Request target location(s) */
  locations: Location[];
}

interface ChatInputProps {
  onSendMessage: (requestData: Request) => void;
  conversationLoaded: boolean;
}

interface ChipBase {
  text: string;
  onClick: (data: object) => void;
}

type DataType = "items" | "locations";

type FilterMap = Record<DataType, string[]>;

/** Composant de saisie de message pour le chatbot, "memo" pour éviter des rendus inutiles */
const ChatInput = memo(({ onSendMessage, conversationLoaded }: ChatInputProps) => {

  /** Submit button states */
  const [submitDisabled, setSubmitDisabled] = useState<boolean>(true);
  const [submitButtonText, setSubmitButtonText] = useState<string>("Suivant");

  /** Set tracking state */
  const [stepIndex, setStepIndex] = useState<number>(1);
  const [optionMaxStep, setOptionMaxStep] = useState<number>(-1);

  /** Request data */
  const [requestData, setRequestData] = useState<Request>({
    option: undefined,
    items: [],
    locations: [],
  });

  /** Chat notice sentence */
  const [noticeMessage, setNoticeMessage] = useState<string>("");

  /** Chip lists */
  const [selection, setSelection] = useState<ChipBase[]>([]);
  const [results, setResults] = useState<ChipBase[]>([]);

  /** Filters */
  const [builtinFiltersCache, setBuiltinFiltersCache] = useState<undefined | FilterMap>(undefined); // Cache available remote builtin filters for each type of data
  const [filters, setFilters] = useState<string[]>([]); // Current filters dropdown values
  const [showFilters, setShowFilters] = useState<boolean>(false); // Toggle filters dropdown menu
  const [builtinFilter, setBuiltinFilter] = useState<string | undefined>(undefined); // Filter results using builtin category, `undefined` mean no filtering is active
  const [searchFilter, setSearchFilter] = useState<string | undefined>(undefined) // Filter results using text search, `undefined` mean no filtering is active


  /** Handle option chip click */
  const onOptionClicked = (option: Option) => {
    console.log("[onOptionClicked]", option.id, option.name);
    setRequestData({
      option: option,
      items: [],
      locations: [],
    });
    // Define the last step index for this option
    const maxStep = stepIndex + Number(option.ask_for_item) + Number(option.ask_for_location);
    console.log("[onOptionClicked] Option max step count:", maxStep);
    setOptionMaxStep(maxStep);
    // No user manual submit
    setStepIndex(stepIndex + 1);
  };

  /** Handle a chip click */
  const onChipClicked = (type: DataType, elem: ResultBase) => {
    setRequestData((prev) => {
      const currentData = prev[type];
      const exists = currentData.some((i) => i.id === elem.id);
      const updatedData = exists ? currentData.filter((i) => i.id !== elem.id) : [...currentData, elem];
      setSubmitDisabled(updatedData.length === 0);
      return {
        ...prev,
        [type]: updatedData,
      };
    });
  };

  /** Reset the form state */
  const resetForm = () => {
    // Reset request data
    setRequestData({
      option: undefined,
      items: [],
      locations: [],
    });
    // Reset lists
    setSelection([]);
    setResults([]);
    // Set default button text
    setSubmitButtonText("Suivant");
    setSubmitDisabled(true);
    // Reset filters
    setShowFilters(false);
    setFilters([]);
    setBuiltinFilter(undefined);
    setSearchFilter(undefined);
    // Reset step tracking
    setStepIndex(1);
  };

  /** Handle submit button event */
  const onSubmitClicked = () => {

    console.log("[onSubmitClicked]");

    // Wait for conversation to be fully loaded by parent component
    if (!conversationLoaded) {
      console.log("Conversation not loaded !");
      return;
    }

    // Time to send the message
    if (stepIndex >= optionMaxStep) {
      onSendMessage(requestData);
      resetForm();
      return;
    }

    // Increment step index
    setStepIndex(stepIndex + 1);

    // Disable submit button
    setSubmitDisabled(true);

    // Reset filters
    setShowFilters(false);
    setFilters([]);
    setBuiltinFilter(undefined);
    setSearchFilter(undefined);
  };

  /** Update the results list with selected and non selected chips */
  const updateChips = (type: DataType, remote: ResultBase[]) => {
    // Get the current selection
    const selection = requestData[type];
    // Create a Set of selected item IDs for quick lookup
    const selectedIds = new Set(selection.map(elem => elem.id));
    // Update list
    setSelection(selection.map((elem) => {
      return {
        text: elem.name,
        onClick: () => onChipClicked(type, elem),
      };
    }));
    // Filter out the selected items from the remote items
    const filteredRemote = remote.filter(elem => !selectedIds.has(elem.id));
    // Update list
    setResults(filteredRemote.map((elem) => {
      return {
        text: elem.name,
        onClick: () => onChipClicked(type, elem),
      };
    }));
  };


  useEffect(() => {

    console.log("[useEffect]", stepIndex);

    // Fetch available filters for each type of data only once
    if (!builtinFiltersCache) {
      Promise.all([getItemFilters(), getLocationFilters()]).then(
        ([itemFilters, locationFilters]) => {
          setBuiltinFiltersCache({
            items: itemFilters,
            locations: locationFilters,
          });
        }
      );
    }

    // Last step reached, update button text to "send"
    if (optionMaxStep > 0 && stepIndex >= optionMaxStep)
      setSubmitButtonText("Envoyer");

    // Handle the option step (1)
    if (requestData.option === undefined) {
      getAvailableOptions()
        .then((options: Option[]) => {
          // Set the message
          setNoticeMessage("Quelles informations souhaitez-vous obtenir ?");
          // Set the list
          setResults(
            options.map((option) => ({
              text: option.description,
              onClick: () => onOptionClicked(option),
            }))
          );
        });
    }
    // Handle the item step (2)
    else if (stepIndex === 2) {
      // Skip this step if disabled
      if (!requestData.option.ask_for_item) {
        setStepIndex(stepIndex + 1);
        return;
      }
      getAvailableItems(builtinFilter, searchFilter)
        .then((items) => {
          // Set the message
          setNoticeMessage("Veuillez choisir un ou plusieurs objets");
          // Set lists with correct values
          updateChips("items", items);
          // Set filters
          setFilters(builtinFiltersCache ? ["none", ...builtinFiltersCache["items"]] : []);
        });
    }
    // Handle the location step (3)
    else if (stepIndex === 3) {
      // Skip this step if disabled
      if (!requestData.option.ask_for_location) {
        setStepIndex(stepIndex + 1);
        return;
      }
      getAvailableLocations(builtinFilter, searchFilter)
        .then((locations) => {
          // Set the message
          setNoticeMessage("Veuillez choisir un ou plusieurs établissement");
          // Set lists with correct values
          updateChips("locations", locations);
          // Set filters
          setFilters(builtinFiltersCache ? ["none", ...builtinFiltersCache["locations"]] : []);
        });
    }

  }, [requestData, stepIndex, builtinFilter, searchFilter]);

  return (
    <div className="w-full max-w-3xl">

      {/* Notice sentence + filter button */}
      <div className="flex items-center justify-between">
        <strong className="text-gray-600 mr-4">{noticeMessage}</strong>
        <div className="flex items-center justify-between">
          <FilterDropdown
            filters={filters}
            show={showFilters}
            toggle={() => setShowFilters((prev) => !prev)}
            selectedFilter={builtinFilter}
            onSelect={setBuiltinFilter}
          />
        </div>
      </div>

      {/* Running selection + results lists */}
      <ChipList chips={selection} selected />
      <ChipList chips={results} />

      {/* Search input + submit button */}
      <hr className="border-t border-gray-300 my-4" />
      <SearchBar
        searchValue={searchFilter}
        onSearchChange={setSearchFilter}
        onSubmit={onSubmitClicked}
        submitDisabled={submitDisabled}
        submitButtonText={submitButtonText}
      />

    </div>
  );
});

ChatInput.displayName = "ChatInput";

export default ChatInput;
