import { Pipe, PipeTransform } from '@angular/core';

export enum StarType {
  Full = 'star_full',
  Half = 'star_half',
  Empty = 'star_border',
}

@Pipe({
  name: 'starsRating',
  standalone: true,
})
export class StarsRatingPipe implements PipeTransform {
  transform(rating: number): StarType[] {
    const stars: StarType[] = [];
    const roundedRating = Math.round(rating * 2) / 2;

    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(roundedRating)) {
        stars.push(StarType.Full);
      } else if (i - 0.5 === roundedRating) {
        stars.push(StarType.Half);
      } else {
        stars.push(StarType.Empty);
      }
    }

    return stars;
  }
}
