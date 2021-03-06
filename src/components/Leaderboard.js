import React from "react";
import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

export default function Leaderboard() {
  function createUniqueContender(winner) {
    return winner;
  }

  const useStyles = makeStyles({
    table: {
      minWidth: 500,
    },
  });
  const [leaderboard, setLeaderboard] = useState();
  const [statsState, setStatsState] = useState();
  const [fightsState, setFightsState] = useState();
  const [isFetching, setIsFetching] = useState(true);
  const fightsOnePokemonWasInvolvedIn = (name) => {
    return fightsState.filter((element) => element === name).length;
  };
  const fetchData = useCallback(async () => {
    try {
      const retrieveLeaderboard = await axios.get(
        `https://pokefight-group4.herokuapp.com/pokemon/game/leaderboard `
      );
      let stats = {};
      let fights = [];
      let everyApperance = [];

      //console.log(retrieveLeaderboard.data);
      for (let fight of retrieveLeaderboard.data) {
        fights.unshift(createUniqueContender(fight.winner));
        stats[fight.winner] ? stats[fight.winner]++ : (stats[fight.winner] = 1);
        everyApperance.push(fight.nameFighterOne, fight.nameFighterTwo);
      }

      let contenders = [...new Set(fights)].sort(function compareNumbers(a, b) {
        return stats[b] - stats[a];
      });

      //console.log(fights.filter((element) => element === "Meltan").length);
      setLeaderboard(contenders);
      setStatsState(stats);
      setFightsState(everyApperance);
      setIsFetching(false);
    } catch (err) {
      console.log(err.message);
    }
  }, []);
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Pokemon</StyledTableCell>
            <StyledTableCell align="center">Victories</StyledTableCell>
            <StyledTableCell align="right">Win Rate</StyledTableCell>
          </TableRow>
        </TableHead>
        {!isFetching && (
          <TableBody>
            {leaderboard.map((row, index) => (
              <StyledTableRow key={index}>
                <StyledTableCell component="th" scope="row">
                  {row}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {statsState[row]}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {Math.round(
                    (statsState[row] / fightsOnePokemonWasInvolvedIn(row)) * 100
                  )}
                  %
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        )}
      </Table>
    </TableContainer>
  );
}
