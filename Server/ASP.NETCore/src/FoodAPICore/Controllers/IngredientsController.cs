﻿using AutoMapper;
using FoodAPICore.Models;
using FoodAPICore.Repositories;
using FoodAPICore.ViewModels;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace FoodAPICore.Controllers
{
    [Route("api")]
    public class IngredientsController : Controller
    {
        IIngredientRepository _repository;
        IFoodRepository _foodRepository;

        public IngredientsController(IIngredientRepository repository, IFoodRepository foodRepository)
        {
            _repository = repository;
            _foodRepository = foodRepository;
        }

        // GET api/food/6/ingridients
        [HttpGet]
        [Route("foods/{foodId}/ingredients")]
        public IActionResult GetIngredientsForFood(Guid foodId)
        {
            if (_foodRepository.GetSingle(foodId) == null)
            {
                return NotFound();
            }

            var allItems = _repository.GetAll().Where(x => x.FoodItem.Id == foodId);

            IEnumerable<IngredientViewModel> viewModels = allItems
               .Select(x => Mapper.Map<IngredientViewModel>(x));

            return Ok(viewModels);
        }

        // GET api/food/6/ingridients/3
        [HttpGet(Name = "GetIngredientForFood")]
        [Route("foods/{foodId}/ingredients/{id}")]
        public IActionResult GetSingleIngredient(Guid foodId, Guid id)
        {
            if (_foodRepository.GetSingle(foodId) == null)
            {
                return NotFound();
            }

            var singleItem = _repository.GetAll().Where(x => x.FoodItem.Id == foodId && x.Id == id).FirstOrDefault();

            if (singleItem == null)
            {
                return NotFound();
            }

            return Ok(Mapper.Map<IngredientViewModel>(singleItem));
        }

        // POST api/food/6
        [HttpPost]
        [Route("foods/{foodId}/ingredients")]
        public IActionResult AddIngredientToFood(Guid foodId, [FromBody] IngredientViewModel ingredient)
        {
            if (ingredient == null)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            FoodItem foodItem = _foodRepository.GetSingle(foodId);

            if (foodItem == null)
            {
                return NotFound("FoodNotFound");
            }

            var ingredientModel = Mapper.Map<Ingredient>(ingredient);

            ingredientModel.FoodItem = foodItem;

            _repository.Add(ingredientModel);

            if (!_repository.Save())
            {
                throw new Exception($"Creating a ingredients for food {foodId} failed on save.");
            }

            var ingredientToReturn = Mapper.Map<IngredientViewModel>(ingredientModel);

            return CreatedAtRoute("GetIngredientForFood",
                new { foodId = foodId, id = ingredientToReturn.Id },
                ingredientToReturn);
        }

        [HttpPut]
        [Route("foods/{foodId}/ingredients/{id}")]
        public IActionResult UpdateIngredientForFood(Guid foodId, Guid id, [FromBody] IngredientUpdateViewModel ingredient)
        {
            if (ingredient == null)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            FoodItem foodItem = _foodRepository.GetSingle(foodId);
            if (foodItem == null)
            {
                return NotFound("FoodNotFound");
            }

            var singleItem = _repository.GetAll().Where(x => x.FoodItem.Id == foodId && x.Id == id).FirstOrDefault();
            if (singleItem == null)
            {
                return NotFound();
            }

            Mapper.Map(ingredient, singleItem);

            Ingredient update = _repository.Update(id, singleItem);

            if (!_repository.Save())
            {
                throw new Exception("Updating an ingredient failed on save.");
            }

            return Ok(Mapper.Map<IngredientViewModel>(singleItem));
        }

        [HttpDelete]
        [Route("foods/{foodId}/ingredients/{id}")]
        public IActionResult Remove(Guid foodId, Guid id)
        {
            FoodItem foodItem = _foodRepository.GetSingle(foodId);

            if (foodItem == null)
            {
                return NotFound("FoodNotFound");
            }

            var singleItem = _repository.GetAll().Where(x => x.FoodItem.Id == foodId && x.Id == id).FirstOrDefault();
            if (singleItem == null)
            {
                return NotFound();
            }

            _repository.Delete(id);

            if (!_repository.Save())
            {
                throw new Exception($"Deleting ingredient {id} for food {foodId} failed on save.");
            }

            return NoContent();
        }
    }
}
