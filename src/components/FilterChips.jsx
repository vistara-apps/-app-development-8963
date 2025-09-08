const FilterChips = ({ filters, setFilters }) => {
  const filterOptions = {
    type: [
      { value: 'all', label: 'All Content' },
      { value: 'music', label: 'Music' },
      { value: 'movie', label: 'Movies' }
    ],
    genre: [
      { value: 'all', label: 'All Genres' },
      { value: 'electronic', label: 'Electronic' },
      { value: 'indie', label: 'Indie' },
      { value: 'ambient', label: 'Ambient' },
      { value: 'synthwave', label: 'Synthwave' },
      { value: 'sci-fi', label: 'Sci-Fi' },
      { value: 'adventure', label: 'Adventure' }
    ],
    platform: [
      { value: 'all', label: 'All Platforms' },
      { value: 'Spotify', label: 'Spotify' },
      { value: 'Apple Music', label: 'Apple Music' },
      { value: 'Netflix', label: 'Netflix' },
      { value: 'Hulu', label: 'Hulu' },
      { value: 'Prime Video', label: 'Prime Video' }
    ]
  }

  const updateFilter = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }))
  }

  return (
    <div className="space-y-3">
      {Object.entries(filterOptions).map(([filterType, options]) => (
        <div key={filterType}>
          <h4 className="text-sm font-medium text-text-secondary mb-2 capitalize">
            {filterType}
          </h4>
          <div className="flex flex-wrap gap-2">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => updateFilter(filterType, option.value)}
                className={`
                  px-3 py-1 rounded-full text-sm transition-colors duration-200
                  ${filters[filterType] === option.value
                    ? 'bg-accent text-black'
                    : 'bg-surface hover:bg-gray-700 text-text-secondary'
                  }
                `}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default FilterChips