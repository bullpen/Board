using Board.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace Board.Context;

public partial class BoardContext : DbContext
{
    public BoardContext()
    {
    }

    public BoardContext(DbContextOptions<BoardContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Account> Accounts { get; set; }

    public virtual DbSet<Models.Entities.Board> Boards { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Account>(entity =>
        {
            entity.HasKey(e => e.Uid);
        });

        modelBuilder.Entity<Board.Models.Entities.Board>(entity =>
        {
            entity.HasKey(e => e.Bid);

            entity.ToTable("Board");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
