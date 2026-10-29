
import React from "react";
import {
    Search,
    RotateCcw,
    SlidersHorizontal,
} from "lucide-react";

export default function EventFilters({
    search,
    setSearch,
    mode,
    setMode,
    map,
    setMap,
    maxFee,
    setMaxFee,
    sort,
    setSort,
    onReset,
}) {
    return (
        <div className="filters-panel">
            {/* Filters heading and reset button */}
            <div className="filters-title">
                <SlidersHorizontal size={17} />

                <span>Find your match</span>

                <button
                    className="reset-link"
                    type="button"
                    onClick={onReset}
                >
                    <RotateCcw size={13} />
                    Reset
                </button>
            </div>

            {/* Filter controls */}
            <div className="filters-grid">
                {/* Search filter */}
                <label className="filter-field search-field">
                    <span>Search</span>

                    <div className="search-control">
                        <Search size={17} />

                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Scrim, organizer or map..."
                        />
                    </div>
                </label>

                {/* Game mode filter */}
                <label className="filter-field">
                    <span>Game mode</span>

                    <select
                        value={mode}
                        onChange={(e) => setMode(e.target.value)}
                    >
                        <option>All</option>
                        <option>Solo</option>
                        <option>Duo</option>
                        <option>Squad</option>
                    </select>
                </label>

                {/* Map filter */}
                <label className="filter-field">
                    <span>Map</span>

                    <select
                        value={map}
                        onChange={(e) => setMap(e.target.value)}
                    >
                        <option>All</option>
                        <option>Erangel</option>
                        <option>Miramar</option>
                        <option>Sanhok</option>
                        <option>Livik</option>
                    </select>
                </label>

                {/* Entry fee filter */}
                <label className="filter-field">
                    <span>Entry fee</span>

                    <select
                        value={maxFee}
                        onChange={(e) => setMaxFee(e.target.value)}
                    >
                        <option value="All">Any fee</option>
                        <option value="0">Free</option>
                        <option value="20">Up to ₹20</option>
                        <option value="50">Up to ₹50</option>
                        <option value="100">Up to ₹100</option>
                    </select>
                </label>

                {/* Sorting filter */}
                <label className="filter-field">
                    <span>Sort by</span>

                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                    >
                        <option value="date">Upcoming date</option>
                        <option value="feeLow">Fee: low to high</option>
                        <option value="feeHigh">Fee: high to low</option>
                        <option value="slots">Most open slots</option>
                        <option value="prize">Highest prize</option>
                    </select>
                </label>
            </div>
        </div>
    );
}
