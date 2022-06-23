import {
  Avatar,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Collapse,
  IconButton,
  Typography,
} from '@mui/material';
import { red } from '@mui/material/colors';
import React from 'react';

export const TripCard = () => {
  return (
    <Card sx={{ maxWidth: 345, maxHeight: '70%' }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            R
          </Avatar>
        }
        title="Retyezat"
      />
      <CardMedia
        component="img"
        height="150"
        image="./retyezat.jpg"
        alt="Paella dish"
      />
      <CardContent>
        <Typography
          sx={{ overflow: 'hidden' }}
          variant="body2"
          color="text.secondary"
        >
          A Retyezát-hegység vagy Zerge-havasok (románul Munții Retezat) a
          Déli-Kárpátok Retyezát–Godján-csoportjának része. Két fontos medence,
          a Hátszegi és a Petrozsényi veszi közre északon és keleten. Délen a
          Nyugati-Zsil határolja, nyugaton a Szárkő-hegység, délnyugaton a
          Godján-hegység, délen a Vulkán-hegység. A Retyezát-hegység vagy
          Zerge-havasok (románul Munții Retezat) a Déli-Kárpátok
          Retyezát–Godján-csoportjának része. Két fontos medence, a Hátszegi és
          a Petrozsényi veszi közre északon és keleten. Délen a Nyugati-Zsil
          határolja, nyugaton a Szárkő-hegység, délnyugaton a Godján-hegység,
          délen a Vulkán-hegység.
        </Typography>
      </CardContent>
      <CardActions disableSpacing></CardActions>
      {/* <CardContent>
        <Typography paragraph>Method:</Typography>
        <Typography paragraph>
          Heat 1/2 cup of the broth in a pot until simmering, add saffron and
          set aside for 10 minutes.
        </Typography>
        <Typography paragraph>
          Heat oil in a (14- to 16-inch) paella pan or a large, deep skillet
          over medium-high heat. Add chicken, shrimp and chorizo, and cook,
          stirring occasionally until lightly browned, 6 to 8 minutes. Transfer
          shrimp to a large plate and set aside, leaving chicken and chorizo in
          the pan. Add pimentón, bay leaves, garlic, tomatoes, onion, salt and
          pepper, and cook, stirring often until thickened and fragrant, about
          10 minutes. Add saffron broth and remaining 4 1/2 cups chicken broth;
          bring to a boil.
        </Typography>
        <Typography paragraph>
          Add rice and stir very gently to distribute. Top with artichokes and
          peppers, and cook without stirring, until most of the liquid is
          absorbed, 15 to 18 minutes. Reduce heat to medium-low, add reserved
          shrimp and mussels, tucking them down into the rice, and cook again
          without stirring, until mussels have opened and rice is just tender, 5
          to 7 minutes more. (Discard any mussels that don&apos;t open.)
        </Typography>
        <Typography>
          Set aside off of the heat to let rest for 10 minutes, and then serve.
        </Typography>
      </CardContent> */}
    </Card>
  );
};
