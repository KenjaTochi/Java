//********************************************************************
//  ECStarsA.java       Author: Ethan Cox
//
//  Due Date: Jan 21, 2024
//
//  Demonstrates the use of nested for loops to print a triangle
//********************************************************************


public class ECStarsA
{
   //-----------------------------------------------------------------
   //  Prints a triangle shape using asterisk (star) characters.
   //-----------------------------------------------------------------
   public static void main(String[] args)
   {
      final int MAX_ROWS = 10;
   
      for (int row = 1; row <= MAX_ROWS; row++)
      {
         for (int star = 11; star > row; star--)
            System.out.print("*");
      
         System.out.println();
      }
   }
}
