//********************************************************************
//  ECAmericanFlag.java       Author: Ethan Cox
//
//  Due Date: N/A
//
//  Prints a American flag with stars and stripes (equal sign)
//  i is the loop conditioner, allows for code conditions to do different things
//  credit goes to Simplilearn for loop knowledge
//  https://www.youtube.com/watch?v=hs45eeZ326U 
//********************************************************************
public class ECAmericanFlag
{
   public static void main(String[] args) 
   {
      // Initialize a counter for the total number of stars
      int starCount = 0;
   
      // The outer loop runs 13 times, once for each stripe on the flag
      for (int i = 0; i < 13; i++) 
      {
         // The first 9 stripes contain stars
         if (i < 9) 
         {
            // Odd stripes start with 6 stars
            if (i % 2 == 0) 
            {
               System.out.print("* * * * * * ");
               starCount += 6;
            } 
            // Even stripes start with 5 stars
            else 
            {
               System.out.print(" * * * * *  ");
               starCount += 5;
            }
            // Each stripe with stars ends with 33 equal signs
            System.out.println("==================================");
         } 
         // The last 4 stripes don't contain stars and consist of 46 equal signs
         else 
         {
            System.out.println("==============================================");
         }
      }
      // Print the total number of stars
      System.out.println("Total Stars: " + starCount);
   }
}
