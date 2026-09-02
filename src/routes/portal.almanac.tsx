import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/portal/almanac")({
  head: () => ({
    meta: [
      { title: "Almanac — Crew On Set! Portal" },
      { name: "description", content: "Your collected gear, roles, and production knowledge." },
      { property: "og:title", content: "Almanac — Crew On Set! Portal" },
      { property: "og:description", content: "Your collected gear, roles, and production knowledge." },
    ],
  }),
  component: AlmanacPage,
});

import Image from "@/components/next-compat/image";
import { useState } from "react";
import { ProductionLogs } from "@/components/portal/production-logs";
import { almanacStore, AlmanacEntry } from "@/lib/demo/almanac";
import {
  Camera,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  Mic,
  Monitor,
  Search,
  Settings2,
  X,
} from "lucide-react";


const categories = [
  { name: "All Equipment", icon: Settings2 },
  { name: "Cameras", icon: Camera },
  { name: "Lighting", icon: Lightbulb },
  { name: "Audio", icon: Mic },
  { name: "Editing", icon: Monitor },
];

const tierStyles = {
  "Low-End": "low",
  "Mid-End": "mid",
  "High-End": "high",
};

function AlmanacPage() {
  const [equipment] = almanacStore.useStore();
  const [category, setCategory] = useState("All Equipment");
  const [selected, setSelected] =
    useState<AlmanacEntry | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const itemsPerPage = 6;

  const filteredEquipment = equipment.filter((item) => {
    const matchesCategory =
      category === "All Equipment" ||
      item.category === category;

    const query = search.trim().toLowerCase();

    if (!query) return matchesCategory;

    const searchableText = [
      item.name,
      item.category,
      item.tier,
      item.role,
      item.description,
      item.gameplay,
      ...item.features,
      ...item.specs.flat(),
    ]
      .join(" ")
      .toLowerCase();

    return (
      matchesCategory &&
      searchableText.includes(query)
    );
  });

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredEquipment.length / itemsPerPage
    )
  );

  const visibleEquipment =
    filteredEquipment.slice(
      (page - 1) * itemsPerPage,
      page * itemsPerPage
    );

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const selectCategory = (value: string) => {
    setCategory(value);
    setPage(1);
  };

  return (
    <div className="portal-page almanac-page">
      <div className="almanac-container">

        <header className="almanac-header">
          <div className="header-title-area">
            <p className="page-eyebrow">
              EQUIPMENT ARCHIVE
            </p>

            <h1 className="almanac-title">
              ALMANAC
            </h1>
          </div>

          {/* SEARCH BAR — FIXED */}
          <div className="search-wrapper">
            <Search className="search-icon" />

            <input
              type="search"
              value={search}
              onChange={(e) =>
                handleSearch(e.target.value)
              }
              placeholder="Search equipment..."
              className="almanac-search"
              aria-label="Search equipment"
            />

            {search.length > 0 && (
              <button
                type="button"
                onClick={() => handleSearch("")}
                className="search-clear"
                aria-label="Clear search"
              >
                <X />
              </button>
            )}
          </div>
        </header>

        <div className="category-tabs-wrapper">
          <div className="category-tabs">
            {categories.map((item) => {
              const Icon = item.icon;
              const active =
                category === item.name;

              return (
                <button
                  type="button"
                  key={item.name}
                  onClick={() =>
                    selectCategory(item.name)
                  }
                  className={
                    active
                      ? "category-tab active"
                      : "category-tab"
                  }
                >
                  <Icon className="category-icon" />

                  <span>{item.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        <section className="equipment-section">
          <div className="section-heading">
            <div>
              <p className="section-eyebrow">
                PRODUCTION DATABASE
              </p>

              <h2>{category}</h2>
            </div>

            <span className="entry-count">
              {filteredEquipment.length} entries
            </span>
          </div>

          {visibleEquipment.length > 0 ? (
            <div className="equipment-grid">
              {visibleEquipment.map((item) => (
                <article
                  key={item.id}
                  className="equipment-card"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setSelected(item)
                    }
                    className="equipment-image"
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="equipment-image-photo"
                    />

                    <div className="image-overlay" />

                    <div className="image-badges">
                      <span
                        className={`tier-badge ${
                          tierStyles[
                            item.tier as keyof typeof tierStyles
                          ]
                        }`}
                      >
                        {item.tier}
                      </span>

                      <span className="role-badge">
                        {item.role}
                      </span>
                    </div>

                    <div className="image-title">
                      <p>{item.category}</p>
                      <h3>{item.name}</h3>
                    </div>
                  </button>

                  <div className="equipment-content">
                    <button
                      type="button"
                      onClick={() =>
                        setSelected(item)
                      }
                      className="view-entry-button"
                    >
                      VIEW MORE
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-results">
              <Search className="empty-icon" />

              <h3>NO EQUIPMENT FOUND</h3>

              <p>
                No equipment matches your search.
              </p>

              <button
                type="button"
                onClick={() =>
                  handleSearch("")
                }
                className="clear-results-button"
              >
                CLEAR SEARCH
              </button>
            </div>
          )}

          {filteredEquipment.length >
            itemsPerPage && (
            <div className="pagination-area">
              <span className="pagination-info">
                Showing{" "}
                {(page - 1) *
                  itemsPerPage +
                  1}
                –
                {Math.min(
                  page * itemsPerPage,
                  filteredEquipment.length
                )}{" "}
                of{" "}
                {filteredEquipment.length}{" "}
                entries
              </span>

              <div className="pagination-buttons">
                <button
                  type="button"
                  disabled={page === 1}
                  onClick={() =>
                    setPage(
                      (p) => p - 1
                    )
                  }
                  className="pagination-arrow"
                >
                  <ChevronLeft />
                </button>

                {Array.from({
                  length: totalPages,
                }).map((_, index) => {
                  const number =
                    index + 1;

                  return (
                    <button
                      type="button"
                      key={number}
                      onClick={() =>
                        setPage(number)
                      }
                      className={
                        page === number
                          ? "pagination-number active"
                          : "pagination-number"
                      }
                    >
                      {number}
                    </button>
                  );
                })}

                <button
                  type="button"
                  disabled={
                    page === totalPages
                  }
                  onClick={() =>
                    setPage(
                      (p) => p + 1
                    )
                  }
                  className="pagination-arrow"
                >
                  <ChevronRight />
                </button>
              </div>
            </div>
          )}
        </section>
      </div>

      <ProductionLogs />

      {selected && (
        <div
          className="modal-backdrop"
          onClick={() =>
            setSelected(null)
          }
        >
          <div
            className="almanac-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <div className="modal-header">
              <div>
                <div className="modal-badges">
                  <span className="modal-category">
                    {selected.category}
                  </span>

                  <span
                    className={`modal-tier ${
                      tierStyles[
                        selected.tier as keyof typeof tierStyles
                      ]
                    }`}
                  >
                    {selected.tier}
                  </span>
                </div>

                <h3 className="modal-title">
                  {selected.name}
                </h3>

                <p className="modal-role">
                  {selected.role} Equipment
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelected(null)
                }
                className="modal-close"
                aria-label="Close"
              >
                <X />
              </button>
            </div>

            <div className="modal-content-layout">
              <div className="modal-image-column">
                <div className="modal-image-box">
                  <Image
                    src={selected.image}
                    alt={selected.name}
                    fill
                    className="modal-image"
                  />

                  <div className="modal-image-overlay" />

                  <div className="modal-image-stamp">
                    <span>ALMANAC</span>
                    <strong>ENTRY</strong>
                  </div>
                </div>

                <div className="modal-image-caption">
                  <div>
                    <span>DEPARTMENT</span>
                    <strong>
                      {selected.category}
                    </strong>
                  </div>

                  <div>
                    <span>ROLE</span>
                    <strong>
                      {selected.role}
                    </strong>
                  </div>

                  <div>
                    <span>CLASS</span>
                    <strong>
                      {selected.tier}
                    </strong>
                  </div>
                </div>

                <section className="left-specifications">
                  <div className="modal-section-heading">
                    <span>04</span>
                    <p>
                      EQUIPMENT
                      SPECIFICATIONS
                    </p>
                  </div>

                  <div className="specifications-box">
                    {selected.specs.map(
                      ([label, value]) => (
                        <div
                          key={label}
                          className="specification-row"
                        >
                          <span>{label}</span>
                          <strong>{value}</strong>
                        </div>
                      )
                    )}
                  </div>
                </section>
              </div>

              <div className="modal-information">
                <section>
                  <div className="modal-section-heading">
                    <span>01</span>
                    <p>ALMANAC ENTRY</p>
                  </div>

                  <h4>
                    EQUIPMENT OVERVIEW
                  </h4>

                  <p className="modal-description">
                    {selected.description}
                  </p>
                </section>

                <section className="modal-section-block">
                  <div className="modal-section-heading">
                    <span>02</span>
                    <p>GAMEPLAY FUNCTION</p>
                  </div>

                  <div className="gameplay-box">
                    <div className="gameplay-accent" />

                    <p>
                      {selected.gameplay}
                    </p>
                  </div>
                </section>

                <section className="features-section">
                  <div className="modal-section-heading">
                    <span>03</span>
                    <p>SPECIAL FEATURES</p>
                  </div>

                  <div className="modal-feature-grid">
                    {selected.features.map(
                      (feature, index) => (
                        <div
                          key={feature}
                          className="modal-feature"
                        >
                          <span className="feature-number">
                            {String(
                              index + 1
                            ).padStart(
                              2,
                              "0"
                            )}
                          </span>

                          <div className="feature-dot" />

                          <span className="feature-name">
                            {feature}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        * {
          box-sizing: border-box;
        }

        .almanac-page {
          min-height: 100vh;
          padding: 32px 24px 48px;
          background: var(--blueprint-paper);
          color: #131b34;
          overflow-x: hidden;
        }

        .almanac-container {
          width: 100%;
          max-width: 1500px;
          margin: 0 auto;
        }

        .almanac-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 30px;
        }

        .header-title-area {
          min-width: 0;
        }

        .page-eyebrow {
          margin: 0;
          color: #ff765f;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.18em;
        }

        .almanac-title {
          margin: 8px 0 0;
          color: #131b34;
          font-size: 48px;
          line-height: 1;
          font-weight: 950;
          letter-spacing: -0.035em;
          text-transform: uppercase;
        }

        /* =====================================================
           SEARCH BAR — FINAL FIX
        ===================================================== */

        .search-wrapper {
          position: relative;

          width: 288px;
          height: 44px;

          flex: 0 0 288px;

          display: flex;
          align-items: center;

          border: 1px solid rgba(19,27,52,.14);
          border-radius: 8px;

          background: var(--blueprint-paper-soft);

          overflow: hidden;

          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease;
        }

        .search-wrapper:focus-within {
          border-color: rgba(
            255,
            118,
            95,
            0.65
          );

          box-shadow:
            0 0 0 3px
            rgba(
              255,
              118,
              95,
              0.08
            );
        }

        .search-icon {
          position: relative;

          flex: 0 0 18px;

          width: 18px;
          height: 18px;

          margin-left: 2px;

          color: #131b34;

          z-index: 2;

          pointer-events: none;
        }

        .almanac-search {
          display: block;

          width: 100%;
          height: 100%;

          min-width: 0;

          margin: 0;

          padding: 0 40px 0 14px;

          border: 0;
          outline: 0;

          background: transparent;

          color: #131b34;

          font-family: inherit;
          font-size: 11px;
          font-weight: 500;

          appearance: none;
          -webkit-appearance: none;
        }

        .almanac-search::placeholder {
          color: #65738a;
          opacity: 1;
        }

        .almanac-search::-webkit-search-cancel-button,
        .almanac-search::-webkit-search-decoration {
          display: none;
          -webkit-appearance: none;
        }

        .search-clear {
          position: absolute;

          top: 50%;
          right: 7px;

          display: grid;
          place-items: center;

          width: 27px;
          height: 27px;

          padding: 0;

          transform: translateY(-50%);

          border: 0;
          border-radius: 5px;

          background: transparent;
          color: #65738a;

          cursor: pointer;
        }

        .search-clear:hover {
          background: rgba(
            255,
            118,
            95,
            0.12
          );

          color: #ff765f;
        }

        .search-clear svg {
          width: 14px;
          height: 14px;
        }

        .category-tabs-wrapper {
          width: 100%;
          margin-top: 26px;
          overflow-x: auto;
          scrollbar-width: none;
        }

        .category-tabs-wrapper::-webkit-scrollbar {
          display: none;
        }

        .category-tabs {
          display: flex;
          align-items: stretch;
          width: 100%;
          min-width: max-content;
          gap: 4px;

          border-bottom:
            1px solid
            rgba(
              255,
              255,
              255,
              0.08
            );
        }

        .category-tab {
          position: relative;

          display: flex;
          align-items: center;
          justify-content: center;

          min-width: 132px;
          height: 58px;

          padding: 0 20px;

          border: none;
          border-bottom: 3px solid transparent;
          border-radius: 8px 8px 0 0;

          background: transparent;
          color: #65738a;

          font-family: inherit;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;

          white-space: nowrap;
          cursor: pointer;
        }

        .category-tab:hover {
          background:
            rgba(
              255,
              255,
              255,
              0.035
            );

          color: #37425a;
        }

        .category-tab.active {
          border-bottom-color: #ff765f;

          background:
            rgba(
              255,
              118,
              95,
              0.09
            );

          color: #ff765f;
        }

        .category-icon {
          width: 17px;
          height: 17px;
          margin-right: 10px;
          flex-shrink: 0;
        }

        .category-tab span {
          line-height: 1;
        }

        .equipment-section {
          margin-top: 30px;
        }

        .section-heading {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
        }

        .section-eyebrow {
          margin: 0 0 7px;
          color: #ff765f;
          font-size: 9px;
          font-weight: 950;
          letter-spacing: 0.18em;
        }

        .section-heading h2 {
          margin: 0;
          color: #131b34;
          font-size: 25px;
          line-height: 1;
          font-weight: 950;
          text-transform: uppercase;
        }

        .entry-count {
          color: #536178;
          font-size: 10px;
          font-weight: 700;
        }

        .equipment-grid {
          display: grid;
          grid-template-columns:
            repeat(
              3,
              minmax(0, 1fr)
            );

          gap: 20px;
          margin-top: 18px;
        }

        .equipment-card {
          overflow: hidden;

          border:
            1px solid
            rgba(
              255,
              255,
              255,
              0.075
            );

          border-radius: 13px;

          background: var(--blueprint-paper-soft);

          box-shadow:
            0 10px 28px
            rgba(0, 0, 0, 0.14);

          transition:
            transform 0.25s ease,
            border-color 0.25s ease,
            box-shadow 0.25s ease;
        }

        .equipment-card:hover {
          transform: translateY(-4px);

          border-color:
            rgba(
              255,
              118,
              95,
              0.35
            );

          box-shadow:
            0 20px 45px
            rgba(0, 0, 0, 0.3);
        }

        .equipment-image {
          position: relative;

          display: block;

          width: 100%;
          aspect-ratio: 16 / 10;

          overflow: hidden;

          padding: 0;
          border: none;

          background: #efece0;

          text-align: left;
          cursor: pointer;
        }

        .equipment-image-photo {
          object-fit: cover;

          transition:
            transform 0.5s ease;
        }

        .equipment-card:hover
          .equipment-image-photo {
          transform: scale(1.05);
        }

        .image-overlay {
          position: absolute;
          inset: 0;

          background:
            linear-gradient(
              to bottom,
              rgba(
                13,
                18,
                28,
                0.12
              ),
              rgba(
                13,
                18,
                28,
                0.94
              )
            );
        }

        .image-badges {
          position: absolute;
          top: 14px;
          left: 14px;

          display: flex;
          gap: 6px;
        }

        .tier-badge,
        .role-badge {
          padding: 6px 9px;
          border-radius: 5px;

          font-size: 7px;
          line-height: 1;
          font-weight: 950;
          letter-spacing: 0.09em;
          text-transform: uppercase;
        }

        .tier-badge.low {
          background:
            rgba(
              255,
              255,
              255,
              0.1
            );

          color:
            rgba(
              255,
              255,
              255,
              0.6
            );
        }

        .tier-badge.mid {
          background:
            rgba(
              217,
              165,
              20,
              0.15
            );

          color: #e5b52d;
        }

        .tier-badge.high {
          background:
            rgba(
              255,
              118,
              95,
              0.15
            );

          color: #ff765f;
        }

        .role-badge {
          border:
            1px solid
            rgba(
              255,
              255,
              255,
              0.12
            );

          background:
            rgba(
              13,
              18,
              28,
              0.72
            );

          color:
            rgba(
              255,
              255,
              255,
              0.78
            );

          backdrop-filter: blur(5px);
        }

        .image-title {
          position: absolute;

          right: 16px;
          bottom: 15px;
          left: 16px;
        }

        .image-title p {
          margin: 0 0 5px;

          color: #ff765f;

          font-size: 8px;
          font-weight: 950;
          letter-spacing: 0.17em;

          text-transform: uppercase;
        }

        .image-title h3 {
          margin: 0;

          color: #ffffff;

          font-size: 23px;
          line-height: 1.05;
          font-weight: 950;

          text-transform: uppercase;
        }

        .equipment-content {
          padding: 15px;
        }

        .view-entry-button {
          width: 100%;
          height: 39px;

          border: none;
          border-radius: 7px;

          background: #eae7db;
          color: #131b34;

          font-family: inherit;
          font-size: 8px;
          font-weight: 950;
          letter-spacing: 0.1em;

          cursor: pointer;
        }

        .view-entry-button:hover {
          background: #ff765f;
        }

        .pagination-area {
          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 20px;
          margin-top: 25px;

          color: #4a5670;
          font-size: 10px;
        }

        .pagination-info {
          white-space: nowrap;
        }

        .pagination-buttons {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .pagination-arrow,
        .pagination-number {
          display: grid;
          place-items: center;

          width: 32px;
          height: 32px;

          padding: 0;

          border:
            1px solid
            rgba(
              255,
              255,
              255,
              0.08
            );

          border-radius: 6px;

          background: var(--blueprint-paper-soft);
          color: #8b97a9;

          font-family: inherit;
          font-size: 10px;
          font-weight: 800;

          cursor: pointer;
        }

        .pagination-number.active {
          border-color: #ff765f;
          background: #ff765f;
          color: #131b34;
        }

        .pagination-arrow:disabled {
          opacity: 0.3;
          cursor: default;
        }

        .pagination-arrow svg {
          width: 15px;
          height: 15px;
        }

        .empty-results {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;

          min-height: 270px;
          margin-top: 18px;

          border:
            1px solid
            rgba(
              255,
              255,
              255,
              0.065
            );

          border-radius: 12px;

          background: var(--blueprint-paper-soft);

          text-align: center;
        }

        .empty-icon {
          width: 30px;
          height: 30px;
          color: rgba(19,27,52,.45);
        }

        .empty-results h3 {
          margin: 14px 0 5px;

          font-size: 15px;
          font-weight: 950;
        }

        .empty-results p {
          margin: 0;

          color: #66738a;
          font-size: 10px;
        }

        .clear-results-button {
          height: 35px;

          margin-top: 15px;
          padding: 0 15px;

          border: none;
          border-radius: 6px;

          background: #eae7db;
          color: white;

          font-family: inherit;
          font-size: 8px;
          font-weight: 950;

          cursor: pointer;
        }

        .modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 70;

          display: grid;
          place-items: center;

          padding: 20px;
          overflow-y: auto;

          background:
            rgba(
              5,
              8,
              13,
              0.86
            );

          backdrop-filter: blur(7px);
        }

        .almanac-modal {
          width: 100%;
          max-width: 920px;
          margin: auto;

          overflow: hidden;

          border:
            1px solid
            rgba(19, 27, 52, 0.176);

          border-radius: 14px;

          background: var(--blueprint-paper-soft);
          color: white;

          box-shadow:
            0 30px 80px
            rgba(0, 0, 0, 0.5);
        }

        .modal-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;

          gap: 20px;
          padding: 20px 22px;

          border-bottom:
            1px solid
            rgba(19, 27, 52, 0.132);
        }

        .modal-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
        }

        .modal-category,
        .modal-tier {
          padding: 7px 10px;

          border-radius: 5px;

          font-size: 9px;
          line-height: 1;
          font-weight: 950;
          letter-spacing: 0.1em;

          text-transform: uppercase;
        }

        .modal-category {
          background: #ff765f;
          color: #131b34;
        }

        .modal-tier.low {
          background: rgba(19, 27, 52, 0.08);

          color: #4a5670;
        }

        .modal-tier.mid {
          background:
            rgba(
              217,
              165,
              20,
              0.14
            );

          color: #e5b52d;
        }

        .modal-tier.high {
          background:
            rgba(
              255,
              118,
              95,
              0.14
            );

          color: #ff765f;
        }

        .modal-title {
          margin: 10px 0 0;

          color: #131b34;

          font-size: 31px;
          line-height: 1;
          font-weight: 950;
          letter-spacing: -0.035em;

          text-transform: uppercase;
        }

        .modal-role {
          margin: 7px 0 0;

          color: #4a5670;

          font-size: 10px;
          font-weight: 850;
          letter-spacing: 0.14em;

          text-transform: uppercase;
        }

        .modal-close {
          display: grid;
          place-items: center;

          width: 40px;
          height: 40px;

          flex-shrink: 0;

          border:
            1px solid
            rgba(19, 27, 52, 0.11);

          border-radius: 8px;

          background: #eae7db;
          color: #4a5670;

          cursor: pointer;
        }

        .modal-close:hover {
          background: #ff765f;
          color: #131b34;
        }

        .modal-close svg {
          width: 20px;
          height: 20px;
        }

        .modal-content-layout {
          display: grid;

          grid-template-columns:
            245px
            minmax(0, 1fr);

          gap: 25px;
          padding: 22px;
        }

        .modal-image-column {
          width: 100%;
        }

        .modal-image-box {
          position: relative;

          width: 100%;
          aspect-ratio: 4 / 3;

          overflow: hidden;

          border:
            1px solid
            rgba(19, 27, 52, 0.176);

          border-radius: 10px;

          background: #efece0;
        }

        .modal-image {
          object-fit: cover;
        }

        .modal-image-overlay {
          position: absolute;
          inset: 0;

          background:
            linear-gradient(
              to bottom,
              transparent 40%,
              rgba(
                8,
                11,
                17,
                0.78
              ) 100%
            );
        }

        .modal-image-stamp {
          position: absolute;

          right: 12px;
          bottom: 11px;

          display: flex;
          flex-direction: column;
          align-items: flex-end;

          gap: 2px;
        }

        .modal-image-stamp span {
          color: #ff765f;

          font-size: 8px;
          font-weight: 950;
          letter-spacing: 0.15em;
        }

        .modal-image-stamp strong {
          color: #ffffff;

          font-size: 10px;
          font-weight: 950;
          letter-spacing: 0.1em;
        }

        .modal-image-caption {
          display: grid;

          grid-template-columns:
            repeat(3, 1fr);

          margin-top: 10px;

          overflow: hidden;

          border:
            1px solid
            rgba(19, 27, 52, 0.132);

          border-radius: 7px;

          background: var(--blueprint-paper-soft);
        }

        .modal-image-caption div {
          min-width: 0;

          padding: 10px 9px;

          border-right:
            1px solid
            rgba(19, 27, 52, 0.132);
        }

        .modal-image-caption
          div:last-child {
          border-right: none;
        }

        .modal-image-caption span {
          display: block;

          margin-bottom: 5px;

          color: #536178;

          font-size: 8px;
          font-weight: 950;
          letter-spacing: 0.1em;

          text-transform: uppercase;
        }

        .modal-image-caption strong {
          display: block;
          overflow: hidden;

          color: #131b34;

          font-size: 10px;
          font-weight: 850;

          white-space: nowrap;
          text-overflow: ellipsis;

          text-transform: uppercase;
        }

        .left-specifications {
          margin-top: 18px;
        }

        .specifications-box {
          overflow: hidden;

          border:
            1px solid
            rgba(19, 27, 52, 0.154);

          border-radius: 8px;

          background: var(--blueprint-paper-soft);
        }

        .specification-row {
          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 10px;

          min-height: 43px;
          padding: 9px 11px;

          border-bottom:
            1px solid
            rgba(19, 27, 52, 0.121);
        }

        .specification-row:last-child {
          border-bottom: none;
        }

        .specification-row span {
          color: #4a5670;

          font-size: 8px;
          font-weight: 950;
          letter-spacing: 0.09em;

          text-transform: uppercase;
        }

        .specification-row strong {
          color: #131b34;

          font-size: 11px;
          font-weight: 900;

          text-align: right;
        }

        .modal-information {
          min-width: 0;
        }

        .modal-section-heading {
          display: flex;
          align-items: center;

          gap: 9px;
          margin-bottom: 9px;
        }

        .modal-section-heading span {
          color: #ff765f;

          font-size: 9px;
          font-weight: 950;
          letter-spacing: 0.08em;
        }

        .modal-section-heading p {
          margin: 0;

          color: #ff765f;

          font-size: 9px;
          font-weight: 950;
          letter-spacing: 0.17em;

          text-transform: uppercase;
        }

        .modal-information h4 {
          margin: 0;

          color: #131b34;

          font-size: 25px;
          line-height: 1.1;
          font-weight: 950;

          text-transform: uppercase;
        }

        .modal-description {
          width: 100%;
          max-width: 535px;

          margin: 12px 0 0;

          color: #37425a;

          font-size: 14px;
          line-height: 1.75;
        }

        .modal-section-block {
          margin-top: 20px;
        }

        .gameplay-box {
          display: flex;
          align-items: stretch;

          gap: 13px;

          width: 100%;
          max-width: 570px;
          min-height: 72px;

          margin-top: 10px;
          padding: 15px 16px;

          border:
            1px solid
            rgba(19, 27, 52, 0.154);

          border-radius: 8px;

          background: var(--blueprint-paper-soft);
        }

        .gameplay-accent {
          width: 3px;
          flex-shrink: 0;

          border-radius: 4px;

          background: #ff765f;
        }

        .gameplay-box p {
          margin: 0;

          color: #37425a;

          font-size: 14px;
          line-height: 1.7;
        }

        .features-section {
          margin-top: 20px;
          max-width: 590px;
        }

        .modal-feature-grid {
          display: grid;

          grid-template-columns:
            repeat(
              2,
              minmax(0, 1fr)
            );

          gap: 9px;
        }

        .modal-feature {
          display: flex;
          align-items: center;

          min-height: 49px;

          gap: 10px;
          padding: 0 13px;

          border:
            1px solid
            rgba(19, 27, 52, 0.143);

          border-radius: 7px;

          background: rgba(19, 27, 52, 0.035);
        }

        .feature-number {
          color: #4a5670;

          font-size: 8px;
          font-weight: 950;
        }

        .feature-dot {
          width: 7px;
          height: 7px;

          flex-shrink: 0;

          border-radius: 50%;

          background: #ff765f;
        }

        .feature-name {
          color: #1c2438;

          font-size: 12px;
          font-weight: 800;
          line-height: 1.4;
        }

        @media (min-width: 640px) {
          .almanac-page {
            padding-left: 32px;
            padding-right: 32px;
          }
        }

        @media (max-width: 1100px) {
          .equipment-grid {
            grid-template-columns:
              repeat(
                2,
                minmax(0, 1fr)
              );
          }
        }

        @media (max-width: 900px) {
          .almanac-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .search-wrapper {
            width: 100%;
            max-width: 420px;
            flex-basis: 44px;
          }

          .modal-content-layout {
            grid-template-columns:
              210px
              minmax(0, 1fr);

            gap: 20px;
          }
        }

        @media (max-width: 700px) {
          .category-tab {
            min-width: 120px;
            height: 55px;
            padding: 0 17px;
            font-size: 11px;
          }

          .category-icon {
            width: 16px;
            height: 16px;
            margin-right: 9px;
          }

          .modal-content-layout {
            grid-template-columns: 1fr;
            gap: 22px;
          }

          .modal-image-box {
            aspect-ratio: 16 / 9;
          }
        }

        @media (max-width: 650px) {
          .equipment-grid {
            grid-template-columns: 1fr;
          }

          .pagination-area {
            flex-wrap: nowrap;
            gap: 8px;
            overflow: hidden;
          }

          .pagination-info {
            min-width: 0;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }

        @media (max-width: 480px) {
          .almanac-page {
            padding: 24px 16px 40px;
          }

          .almanac-title {
            font-size: 38px;
          }

          .search-wrapper {
            width: 100%;
            max-width: none;
          }

          .modal-header {
            padding: 16px;
          }

          .modal-title {
            font-size: 25px;
          }

          .modal-content-layout {
            padding: 16px;
          }

          .modal-image-caption {
            grid-template-columns: 1fr;
          }

          .modal-image-caption div {
            border-right: none;

            border-bottom:
              1px solid
              rgba(
                255,
                255,
                255,
                0.06
              );
          }

          .modal-image-caption
            div:last-child {
            border-bottom: none;
          }

          .modal-feature-grid {
            grid-template-columns: 1fr;
          }

          .pagination-arrow,
          .pagination-number {
            width: 28px;
            height: 28px;
          }
        }
      `}</style>
    </div>
  );
}