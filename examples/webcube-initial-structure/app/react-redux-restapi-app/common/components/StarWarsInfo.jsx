import React, { PureComponent } from 'react';
import { Bind } from 'lodash-decorators';

import styles from '../styles/info.scss';

export default class StarWarsInfo extends PureComponent {
  @Bind
  handleCharacterSearch(e) {
    if (e.key === 'Enter') {
      const characterId = e.target.value;
      this.props.actions.starWarsSource.showCharacter({ characterId });
    }
  }

  @Bind
  handleShipSearch(e) {
    if (e.key === 'Enter') {
      const shipId = e.target.value;
      this.props.actions.starWarsSource.showShip({ shipId });
    }
  }

  @Bind
  handleCharacterIdInput(e) {
    this.props.actions.character.inputId(e.target.value);
  }

  @Bind
  handleShipIdInput(e) {
    this.props.actions.ship.inputId(e.target.value);
  }

  @Bind
  handleCharacterFieldChange(e) {
    this.props.actions.character.changeField({
      id: e.target.getAttribute('data-id'),
      name: e.target.getAttribute('data-name'),
      value: e.target.value,
    });
  }

  @Bind
  handleShipFieldChange(e) {
    this.props.actions.ship.changeField({
      id: e.target.getAttribute('data-id'),
      name: e.target.getAttribute('data-name'),
      value: e.target.value,
    });
  }

  renderShip(ship) {
    return (
      <div>
        <p className={styles['result-title']}>{ship.name}</p>
        <p>
          <label>Model</label>
          <input
            type="text"
            value={ship.model}
            data-name="model"
            data-id={ship.url}
            onChange={this.handleShipFieldChange}
          />
        </p>
        <p>
          <label>Films</label>
        </p>
        <ul>
          {ship.films.length ? (
            ship.films.map(film => (
              <li key={`${film.url}-${film.url}`}>
                <p className={styles['result-title']}>{film.name}</p>
                <p>
                  <label>Director</label>
                  {film.director}
                </p>
              </li>
            ))
          ) : (
            <li>
              <p>None</p>
            </li>
          )}
        </ul>
      </div>
    );
  }

  render() {
    const {
      characterId,
      shipId,
      source: { result: { character, ship } },
    } = this.props;
    return (
      <div className={styles.box}>
        <h2>Star Wars API</h2>
        <h3>Character Info</h3>
        <input
          type="text"
          value={characterId}
          placeholder="Character ID (eg. 1, 2, 3, ...)"
          className={styles.input}
          onChange={this.handleCharacterIdInput}
          onKeyPress={this.handleCharacterSearch}
        />
        {character && (
          <div className={styles.info}>
            <h4>Result</h4>
            <p className={styles['result-title']}>{character.name}</p>
            <p>
              <label>Height</label>
              <input
                type="text"
                data-name="height"
                data-id={character.url}
                value={character.height}
                onChange={this.handleCharacterFieldChange}
              />
            </p>
            <p>
              <label>Ships</label>
            </p>
            <ul>
              {character.ships.length ? (
                character.ships.map(childShip => (
                  <li key={childShip.url}>{this.renderShip(childShip)}</li>
                ))
              ) : (
                <li>
                  <p>None</p>
                </li>
              )}
            </ul>
          </div>
        )}
        <h3>Starship Info</h3>
        <input
          type="text"
          value={shipId}
          placeholder="Ship ID (eg. 1, 2, 3, ...)"
          className={styles.input}
          onChange={this.handleShipIdInput}
          onKeyPress={this.handleShipSearch}
        />
        {ship && (
          <div className={styles.info}>
            <h4>Result:</h4>
            {this.renderShip(ship)}
          </div>
        )}
      </div>
    );
  }
}
