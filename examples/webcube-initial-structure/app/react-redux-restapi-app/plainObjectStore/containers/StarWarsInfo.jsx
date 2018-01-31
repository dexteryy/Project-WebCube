import React, { PureComponent } from 'react';
import Helmet from 'react-helmet';
import { autobind } from 'core-decorators';
import connectSource from 'redux-source/lib/connectSource';
import { connect } from 'redux-cube';

import { actions, starWarsSource } from '../ducks/starWarsInfo';
import styles from './StarWarsInfo.scss';

@connectSource(starWarsSource, {
  slice: state => state.starWarsInfo,
})
@connect({
  selectors: [
    state => state.starWarsInfo.characterId,
    state => state.starWarsInfo.shipId,
  ],
  transform: (characterId, shipId) => ({
    characterId,
    shipId,
  }),
  actions,
})
export default class StarWarsInfo extends PureComponent {
  @autobind
  handleCharacterSearch(e) {
    if (e.key === 'Enter') {
      const characterId = e.target.value;
      this.props.actions.starWarsSource.showCharacter({ characterId });
    }
  }

  @autobind
  handleShipSearch(e) {
    if (e.key === 'Enter') {
      const shipId = e.target.value;
      this.props.actions.starWarsSource.showShip({ shipId });
    }
  }

  @autobind
  handleCharacterIdInput(e) {
    this.props.actions.character.inputId(e.target.value);
  }

  @autobind
  handleShipIdInput(e) {
    this.props.actions.starship.inputId(e.target.value);
  }

  @autobind
  handleCharacterFieldChange(e) {
    this.props.actions.character.changeField({
      name: e.target.getAttribute('name'),
      value: e.target.value,
    });
  }

  @autobind
  handleStarshipFieldChange(e) {
    this.props.actions.starship.changeField({
      name: e.target.getAttribute('name'),
      value: e.target.value,
    });
  }

  render() {
    const {
      isEnabled,
      characterId,
      shipId,
      source: {
        data: { character, starship },
        errors: sourceErrors,
        isPending: isSourceLoading,
      },
    } = this.props;
    return (
      <div
        className={styles.box}
        style={
          !isEnabled
            ? {
                display: 'none',
              }
            : {}
        }>
        <Helmet
          title="React + Redux + Restful API App - Plain Object Store - Star Wars Info"
          meta={[{ name: 'description', content: '' }]}
        />
        <h2>Star Wars Info (Plain Object Store)</h2>
        {isSourceLoading && <p className={styles.loading}>Loading...</p>}
        {sourceErrors.length > 0 && (
          <p className={styles.error}>
            Error! {sourceErrors.map(({ message }) => message)}
          </p>
        )}
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
                name="height"
                value={character.height}
                onChange={this.handleCharacterFieldChange}
              />
            </p>
            <p>
              <label>Ships</label>
            </p>
            <ul>
              {character.starships.length ? (
                character.starships.map(ship => (
                  <li key={ship.url}>
                    <p className={styles['result-title']}>{ship.name}</p>
                    <p>
                      <label>Model</label>
                      {ship.model}
                    </p>
                    <p>
                      <label>Films</label>
                    </p>
                    <ul>
                      {ship.films.length ? (
                        ship.films.map(film => (
                          <li key={`${film.url}-${film.url}`}>
                            <p className={styles['result-title']}>
                              {film.title}
                            </p>
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
                  </li>
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
        {starship && (
          <div className={styles.info}>
            <h4>Result:</h4>
            <p className={styles['result-title']}>{starship.name}</p>
            <p>
              <label>Model</label>
              <input
                type="text"
                name="model"
                value={starship.model}
                onChange={this.handleStarshipFieldChange}
              />
            </p>
          </div>
        )}
      </div>
    );
  }
}
